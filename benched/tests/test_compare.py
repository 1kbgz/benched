from dataclasses import replace
from pathlib import Path

import pytest

from benched.compare import (
    BenchmarkRunError,
    CompareError,
    CompatibilityError,
    ThresholdError,
    compare_baseline,
    compare_runs,
    parse_threshold,
    regression_gate,
)
from benched.model import load_run
from benched.query import RunFilters, encode_benchmark_id

FIXTURES = Path(__file__).with_name("fixtures")


def _run(run_id: str, value: float, *, metric="median", status="success"):
    source = load_run(FIXTURES / "canonical-run-v1.json")
    measurement = replace(source.measurements[0], stats={metric: value})
    return replace(source, run_id=run_id, status=status, measurements=(measurement,))


@pytest.mark.parametrize(
    ("head", "status", "percent"),
    [(8.0, "improved", -20.0), (10.0, "unchanged", 0.0), (12.0, "regressed", 20.0)],
)
def test_classifies_timing_changes(head, status, percent):
    result = compare_runs(_run("base", 10.0), _run("head", head))

    assert result.differences[0].status == status
    assert result.differences[0].percent == percent


def test_operations_per_second_reverses_improvement_direction():
    result = compare_runs(_run("base", 10.0, metric="ops"), _run("head", 8.0, metric="ops"), metric="ops")

    assert result.differences[0].status == "regressed"
    assert result.differences[0].delta == -2.0


def test_peak_memory_is_lower_is_better_and_gateable():
    result = compare_runs(
        _run("base", 100.0, metric="peak_memory"),
        _run("head", 125.0, metric="peak_memory"),
        metric="peak_memory",
    )

    assert result.differences[0].status == "regressed"
    assert regression_gate(result, parse_threshold("peak_memory:20")) is True


def test_marks_added_removed_and_unavailable_measurements():
    base = _run("base", 10.0)
    original = base.measurements[0]
    removed = replace(original, benchmark_id="removed")
    unavailable = replace(original, benchmark_id="shared", stats={})
    head = replace(_run("head", 10.0), measurements=(replace(original, benchmark_id="added"), unavailable))
    result = compare_runs(replace(base, measurements=(removed, replace(original, benchmark_id="shared"))), head)

    assert [difference.status for difference in result.differences] == ["added", "removed", "incompatible"]
    assert result.differences[-1].reason == "metric 'median' is unavailable"


def test_marks_unit_mismatch_incompatible():
    base = _run("base", 10.0)
    head_measurement = replace(_run("head", 11.0).measurements[0], unit="bytes")
    head = replace(_run("head", 11.0), measurements=(head_measurement,))

    result = compare_runs(base, head)

    assert result.differences[0].status == "incompatible"
    assert result.differences[0].reason == "unit differs"


def test_blocks_context_mismatch_unless_allowed():
    base = _run("base", 10.0)
    head = replace(_run("head", 11.0), machine=replace(base.machine, fingerprint="other"))

    with pytest.raises(CompatibilityError, match="machine fingerprint differs"):
        compare_runs(base, head)

    allowed = compare_runs(base, head, allow_mismatch=True)
    assert allowed.warnings[0].startswith("machine fingerprint differs")


def test_rejects_failed_run_with_distinct_error():
    with pytest.raises(BenchmarkRunError, match="unsuccessful run: head"):
        compare_runs(_run("base", 10.0), _run("head", 11.0, status="failed"))


def test_percentage_threshold_boundary_and_regression():
    boundary = compare_runs(_run("base", 10.0), _run("head", 11.0))
    over = compare_runs(_run("base", 10.0), _run("head", 11.01))
    threshold = parse_threshold("median:10%")

    assert regression_gate(boundary, threshold) is False
    assert regression_gate(over, threshold) is True


def test_absolute_threshold_and_ops_direction():
    result = compare_runs(_run("base", 10.0, metric="ops"), _run("head", 8.9, metric="ops"), metric="ops")

    assert regression_gate(result, parse_threshold("ops:1")) is True


def test_percentage_threshold_rejects_zero_baseline():
    result = compare_runs(_run("base", 0.0), _run("head", 1.0))

    with pytest.raises(ThresholdError, match="undefined for zero baseline"):
        regression_gate(result, parse_threshold("1%"))


def test_rejects_filters_with_no_measurements():
    with pytest.raises(CompareError, match="no measurements match"):
        compare_runs(_run("base", 10.0), _run("head", 11.0), filters=RunFilters(group="missing"))


@pytest.mark.parametrize("value", ["median:nope", "median:-1", "median:nan", "unknown:1%"])
def test_invalid_threshold_is_actionable(value):
    with pytest.raises(ThresholdError):
        parse_threshold(value)


def _solver_run(run_id="run", *, status="success"):
    source = load_run(FIXTURES / "canonical-run-v1.json")
    template = source.measurements[0]
    measurements = tuple(
        replace(
            template,
            benchmark_id=encode_benchmark_id("tests/test_solver.py::test_solve", parameters),
            parameters=parameters,
            stats={"median": median},
        )
        for parameters, median in (
            ({"solver": "mosek", "size": 10}, 1.0),
            ({"solver": "internal", "size": 10}, 2.0),
            ({"solver": "mosek", "size": 20}, 4.0),
            ({"solver": "internal", "size": 20}, 3.0),
            ({"solver": "internal", "size": 30}, 9.0),
        )
    )
    return replace(source, run_id=run_id, status=status, measurements=measurements)


def test_baseline_pairs_variants_by_remaining_parameters():
    result = compare_baseline(_solver_run(), key="solver", value="mosek")

    assert result.base_run_id == result.head_run_id == "run"
    assert [(difference.base, difference.head, difference.ratio, difference.status) for difference in result.differences] == [
        (1.0, 2.0, 2.0, "regressed"),
        (4.0, 3.0, 0.75, "improved"),
    ]
    assert result.warnings == ("no baseline measurement for tests/test_solver.py::test_solve|size=30&solver=%22internal%22",)


def test_baseline_respects_measurement_filters():
    result = compare_baseline(_solver_run(), key="solver", value="mosek", filters=RunFilters(parameters={"size": 10}))

    assert len(result.differences) == 1
    assert result.differences[0].ratio == 2.0


def test_baseline_without_matching_measurements_is_actionable():
    with pytest.raises(CompareError, match="no measurements match baseline solver='cplex'"):
        compare_baseline(_solver_run(), key="solver", value="cplex")

    with pytest.raises(BenchmarkRunError, match="unsuccessful run"):
        compare_baseline(_solver_run(status="failed"), key="solver", value="mosek")
