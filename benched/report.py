from __future__ import annotations

from collections.abc import Sequence
from datetime import UTC, datetime
from pathlib import Path
from typing import Any, TextIO, TypedDict

import pluggy

from .compare import SUPPORTED_METRICS
from .config import Config
from .hooks import ReportHookContext, call_hook, create_plugin_manager
from .model import Identity, Measurement, Report, Run
from .query import RunFilters, filter_measurements
from .reporters import ReportArtifact, Reporter, run_reporters


class ReportError(ValueError):
    """Raised when selected history cannot produce a report."""


class _SeriesPoint(TypedDict):
    run_id: str
    metrics: dict[str, float | None]


class _Benchmark(TypedDict):
    benchmark_id: str
    nodeid: str
    name: str
    group: str | None
    parameters: dict[str, Any]
    unit: str
    series: list[_SeriesPoint]


def _timestamp(value: str) -> datetime:
    try:
        result = datetime.fromisoformat(value)
    except ValueError as error:
        raise ReportError(f"invalid run timestamp {value!r}") from error
    if result.tzinfo is None:
        raise ReportError(f"run timestamp must include a timezone: {value!r}")
    return result


def _identity(identity: Identity) -> dict[str, Any]:
    return {
        "name": identity.name,
        "repository": identity.repository,
        "version": identity.version,
        "revision": identity.revision,
        "branch": identity.branch,
        "dirty": identity.dirty,
        "labels": dict(sorted(identity.labels.items())),
    }


def _run_summary(run: Run) -> dict[str, Any]:
    return {
        "run_id": run.run_id,
        "started_at": run.started_at,
        "status": run.status,
        "suite": _identity(run.suite),
        "subject": _identity(run.subject),
        "machine": {
            "id": run.machine.id,
            "fingerprint": run.machine.fingerprint,
            "metadata": dict(sorted(run.machine.metadata.items())),
            "labels": dict(sorted(run.machine.labels.items())),
        },
        "environment": {
            "fingerprint": run.environment.fingerprint,
            "python_implementation": run.environment.python_implementation,
            "python_version": run.environment.python_version,
            "platform": run.environment.platform,
            "architecture": run.environment.architecture,
            "labels": dict(sorted(run.environment.labels.items())),
        },
    }


def _metrics(measurement: Measurement) -> dict[str, float | None]:
    metrics: dict[str, float | None] = {}
    for metric in SUPPORTED_METRICS:
        value = measurement.stats.get(metric)
        metrics[metric] = float(value) if isinstance(value, (int, float)) and not isinstance(value, bool) else None
    return metrics


def compile_report(runs: Sequence[Run], *, filters: RunFilters | None = None) -> Report:
    if not runs:
        raise ReportError("no runs selected for report")
    ordered_runs = sorted(runs, key=lambda run: (_timestamp(run.ended_at), run.run_id))
    active_filters = filters or RunFilters()
    benchmarks: dict[str, _Benchmark] = {}
    warnings: set[str] = set()
    for run in ordered_runs:
        for measurement in filter_measurements(run, active_filters):
            benchmark = benchmarks.get(measurement.benchmark_id)
            if benchmark is None:
                new_benchmark: _Benchmark = {
                    "benchmark_id": measurement.benchmark_id,
                    "nodeid": measurement.nodeid,
                    "name": measurement.name,
                    "group": measurement.group,
                    "parameters": measurement.parameters,
                    "unit": measurement.unit,
                    "series": [],
                }
                benchmarks[measurement.benchmark_id] = new_benchmark
                benchmark = new_benchmark
            elif (
                benchmark["nodeid"] != measurement.nodeid
                or benchmark["name"] != measurement.name
                or benchmark["group"] != measurement.group
                or benchmark["parameters"] != measurement.parameters
                or benchmark["unit"] != measurement.unit
            ):
                warnings.add(f"benchmark metadata differs across runs: {measurement.benchmark_id}")
            benchmark["series"].append({"run_id": run.run_id, "metrics": _metrics(measurement)})
    if not benchmarks:
        raise ReportError("no measurements match the report filters")

    generated_at = max(_timestamp(run.ended_at) for run in ordered_runs).astimezone(UTC).isoformat()
    report = Report(
        generated_at=generated_at,
        source_run_ids=tuple(run.run_id for run in ordered_runs),
        runs=tuple(_run_summary(run) for run in ordered_runs),
        benchmarks=tuple(dict(benchmarks[benchmark_id]) for benchmark_id in sorted(benchmarks)),
        warnings=tuple(sorted(warnings)),
    )
    return Report.from_dict(report.to_dict())


def generate_report(
    config: Config,
    runs: Sequence[Run],
    *,
    filters: RunFilters,
    reporter_names: tuple[str, ...],
    output: Path,
    metric: str,
    stream: TextIO,
    plugin_manager: pluggy.PluginManager | None = None,
    reporters: dict[str, Reporter] | None = None,
) -> tuple[Report, tuple[ReportArtifact, ...]]:
    manager = plugin_manager or create_plugin_manager()
    context = ReportHookContext(config=config, filters=filters, runs=list(runs))
    call_hook(manager, "benched_before_report", context)
    report = compile_report(context.runs, filters=context.filters)
    artifacts = run_reporters(report, reporter_names, output=output, metric=metric, stream=stream, reporters=reporters)
    context.report = report
    context.artifacts.extend(artifact.path for artifact in artifacts)
    call_hook(manager, "benched_after_report", context)
    return report, artifacts
