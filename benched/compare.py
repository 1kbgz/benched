from __future__ import annotations

from dataclasses import dataclass
from math import isfinite
from typing import Literal

from .model import Measurement, Run
from .query import RunFilters, filter_measurements

SUPPORTED_METRICS = ("median", "mean", "min", "max", "ops")

ComparisonStatus = Literal["improved", "regressed", "unchanged", "added", "removed", "incompatible"]


class CompareError(ValueError):
    """Raised when two runs cannot be compared as requested."""


class CompatibilityError(CompareError):
    """Raised when run contexts are incompatible."""


class BenchmarkRunError(CompareError):
    """Raised when an explicitly selected benchmark run failed."""


class ThresholdError(CompareError):
    """Raised when a regression threshold cannot be evaluated."""


class ThresholdEvaluationError(ThresholdError):
    """Raised when valid threshold syntax cannot be applied to comparison data."""


@dataclass(frozen=True, slots=True)
class Difference:
    benchmark_id: str
    nodeid: str
    name: str
    status: ComparisonStatus
    unit: str
    base: float | None
    head: float | None
    delta: float | None
    ratio: float | None
    percent: float | None
    reason: str | None = None


@dataclass(frozen=True, slots=True)
class RunComparison:
    base_run_id: str
    head_run_id: str
    metric: str
    differences: tuple[Difference, ...]
    warnings: tuple[str, ...] = ()


@dataclass(frozen=True, slots=True)
class RegressionThreshold:
    metric: str
    value: float
    percentage: bool


def _context_mismatches(base: Run, head: Run) -> tuple[str, ...]:
    mismatches: list[str] = []
    if base.subject.name != head.subject.name:
        mismatches.append(f"subject differs ({base.subject.name!r} vs {head.subject.name!r})")
    if base.machine.fingerprint != head.machine.fingerprint:
        mismatches.append(f"machine fingerprint differs ({base.machine.id!r} vs {head.machine.id!r})")
    if base.environment.fingerprint != head.environment.fingerprint:
        mismatches.append(f"environment fingerprint differs ({base.environment.python_version!r} vs {head.environment.python_version!r})")
    return tuple(mismatches)


def _metric(measurement: Measurement, metric: str) -> float | None:
    value = measurement.stats.get(metric)
    if isinstance(value, (int, float)) and not isinstance(value, bool) and isfinite(value):
        return float(value)
    return None


def _difference(benchmark_id: str, base: Measurement | None, head: Measurement | None, metric: str) -> Difference:
    measurement = head or base
    assert measurement is not None
    if base is None:
        return Difference(
            benchmark_id, measurement.nodeid, measurement.name, "added", measurement.unit, None, _metric(measurement, metric), None, None, None
        )
    if head is None:
        return Difference(
            benchmark_id, measurement.nodeid, measurement.name, "removed", measurement.unit, _metric(measurement, metric), None, None, None, None
        )
    if base.unit != head.unit:
        return Difference(benchmark_id, head.nodeid, head.name, "incompatible", head.unit, None, None, None, None, None, "unit differs")
    base_value = _metric(base, metric)
    head_value = _metric(head, metric)
    if base_value is None or head_value is None:
        return Difference(
            benchmark_id,
            head.nodeid,
            head.name,
            "incompatible",
            head.unit,
            base_value,
            head_value,
            None,
            None,
            None,
            f"metric {metric!r} is unavailable",
        )

    delta = head_value - base_value
    ratio = head_value / base_value if base_value != 0 else None
    percent = delta / base_value * 100 if base_value != 0 else None
    if head_value == base_value:
        status: ComparisonStatus = "unchanged"
    elif metric == "ops":
        status = "improved" if head_value > base_value else "regressed"
    else:
        status = "improved" if head_value < base_value else "regressed"
    return Difference(benchmark_id, head.nodeid, head.name, status, head.unit, base_value, head_value, delta, ratio, percent)


def compare_runs(
    base: Run,
    head: Run,
    *,
    metric: str = "median",
    filters: RunFilters | None = None,
    allow_mismatch: bool = False,
) -> RunComparison:
    if metric not in SUPPORTED_METRICS:
        raise CompareError(f"unsupported metric {metric!r}; choose from {', '.join(SUPPORTED_METRICS)}")
    failed = [run.run_id for run in (base, head) if run.status != "success"]
    if failed:
        raise BenchmarkRunError(f"cannot compare unsuccessful run{'s' if len(failed) != 1 else ''}: {', '.join(failed)}")
    mismatches = _context_mismatches(base, head)
    if mismatches and not allow_mismatch:
        raise CompatibilityError("incompatible runs: " + "; ".join(mismatches))

    active_filters = filters or RunFilters()
    base_measurements = {measurement.benchmark_id: measurement for measurement in filter_measurements(base, active_filters)}
    head_measurements = {measurement.benchmark_id: measurement for measurement in filter_measurements(head, active_filters)}
    if not base_measurements and not head_measurements:
        raise CompareError("no measurements match the current filters")
    differences = tuple(
        _difference(benchmark_id, base_measurements.get(benchmark_id), head_measurements.get(benchmark_id), metric)
        for benchmark_id in sorted(base_measurements.keys() | head_measurements.keys())
    )
    return RunComparison(
        base_run_id=base.run_id,
        head_run_id=head.run_id,
        metric=metric,
        differences=differences,
        warnings=mismatches if allow_mismatch else (),
    )


def parse_threshold(value: str, *, default_metric: str = "median") -> RegressionThreshold:
    metric, separator, raw_threshold = value.partition(":")
    if not separator:
        metric, raw_threshold = default_metric, metric
    if metric not in SUPPORTED_METRICS:
        raise ThresholdError(f"unsupported threshold metric {metric!r}; choose from {', '.join(SUPPORTED_METRICS)}")
    percentage = raw_threshold.endswith("%")
    number = raw_threshold[:-1] if percentage else raw_threshold
    try:
        threshold = float(number)
    except ValueError as error:
        raise ThresholdError(f"invalid regression threshold {value!r}") from error
    if not isfinite(threshold) or threshold < 0:
        raise ThresholdError("regression threshold must be a finite non-negative number")
    return RegressionThreshold(metric=metric, value=threshold, percentage=percentage)


def regression_gate(comparison: RunComparison, threshold: RegressionThreshold) -> bool:
    if comparison.metric != threshold.metric:
        raise ThresholdError(f"threshold metric {threshold.metric!r} does not match comparison metric {comparison.metric!r}")
    for difference in comparison.differences:
        if difference.status != "regressed":
            continue
        if threshold.percentage:
            if difference.percent is None:
                raise ThresholdEvaluationError(f"percentage regression is undefined for zero baseline: {difference.benchmark_id}")
            slowdown = -difference.percent if comparison.metric == "ops" else difference.percent
        else:
            assert difference.delta is not None
            slowdown = -difference.delta if comparison.metric == "ops" else difference.delta
        if slowdown > threshold.value:
            return True
    return False
