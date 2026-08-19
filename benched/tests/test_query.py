from dataclasses import replace
from pathlib import Path

import pytest

from benched.model import load_run
from benched.query import (
    QueryError,
    RunFilters,
    apply_aliases,
    encode_benchmark_id,
    filter_measurements,
    filter_runs,
    latest_measurements,
    resolve_selector,
)
from benched.storage import StoredRun

FIXTURES = Path(__file__).with_name("fixtures")


def _stored(run_id: str, ended_at: str, *, status="success", revision=None, machine="ci") -> StoredRun:
    source = load_run(FIXTURES / "canonical-run-v1.json")
    subject = replace(source.subject, revision=revision or run_id)
    run = replace(source, run_id=run_id, ended_at=ended_at, status=status, subject=subject, machine=replace(source.machine, id=machine))
    return StoredRun(location=f"memory://results/{run_id}.json", run=run)


def test_latest_and_previous_ignore_failed_runs():
    runs = (
        _stored("old-success", "2026-01-01T00:00:00+00:00"),
        _stored("new-success", "2026-01-02T00:00:00+00:00"),
        _stored("newest-failed", "2026-01-03T00:00:00+00:00", status="failed"),
    )

    assert resolve_selector(runs, "latest").run.run_id == "new-success"
    assert resolve_selector(runs, "previous").run.run_id == "old-success"
    assert resolve_selector(runs, "newest").run.status == "failed"


def test_latest_measurements_coalesces_partial_successful_runs():
    old = _stored("old", "2026-01-01T00:00:00+00:00")
    first, second = old.run.measurements[0], replace(old.run.measurements[0], benchmark_id="second", name="second")
    old = replace(old, run=replace(old.run, measurements=(first, second)))
    newest = _stored("newest", "2026-01-02T00:00:00+00:00")
    newest_first = replace(first, stats={"median": 0.5})
    newest = replace(newest, run=replace(newest.run, measurements=(newest_first,)))
    failed = _stored("failed", "2026-01-03T00:00:00+00:00", status="failed")
    failed_second = replace(second, stats={"median": 0.1})
    failed = replace(failed, run=replace(failed.run, measurements=(failed_second,)))

    selected = latest_measurements((failed, newest, old))

    assert [stored.run.run_id for stored in selected] == ["old", "newest"]
    assert [measurement.benchmark_id for measurement in selected[0].run.measurements] == ["second"]
    assert selected[1].run.measurements == (newest_first,)


def test_selector_applies_filters_before_resolution():
    runs = (
        _stored("local-run", "2026-01-01T00:00:00+00:00", machine="local"),
        _stored("ci-run", "2026-01-02T00:00:00+00:00"),
    )

    selected = resolve_selector(runs, "latest", filters=RunFilters(machine="local"))

    assert selected.run.run_id == "local-run"


def test_ambiguous_revision_lists_run_ids():
    runs = (
        _stored("first", "2026-01-01T00:00:00+00:00", revision="shared-revision"),
        _stored("second", "2026-01-02T00:00:00+00:00", revision="shared-revision"),
    )

    with pytest.raises(QueryError, match="ambiguous: first, second"):
        resolve_selector(runs, "shared")


def test_filters_measurements_by_glob_group_and_named_parameter():
    stored = _stored("run", "2026-01-01T00:00:00+00:00")
    filters = RunFilters(benchmark="*test_parse*", group="parse", parameters={"size": 100})

    assert len(filter_runs((stored,), filters)) == 1
    assert len(filter_measurements(stored.run, filters)) == 1

    missing = replace(filters, parameters={"size": 200})
    assert filter_runs((stored,), missing) == ()

    exact = replace(filters, benchmark="tests/test_parse.py::test_parse[100]")
    assert len(filter_measurements(stored.run, exact)) == 1


def test_label_selector_matches_subject_or_suite_labels():
    stored = _stored("run", "2026-01-01T00:00:00+00:00")
    run = replace(stored.run, subject=replace(stored.run.subject, labels={"track": "nightly"}))

    assert resolve_selector((replace(stored, run=run),), "track=nightly").run.run_id == "run"


def test_missing_previous_is_actionable():
    with pytest.raises(QueryError, match="at least 2 successful matching runs"):
        resolve_selector((_stored("only", "2026-01-01T00:00:00+00:00"),), "previous")


def test_aliases_rewrite_benchmark_and_parameter_identities():
    stored = _stored("run", "2026-01-01T00:00:00+00:00")
    imported = replace(
        stored.run.measurements[0],
        benchmark_id=encode_benchmark_id("suite.Old.time_parse", {"problem_size": 100}),
        nodeid="suite.Old.time_parse",
        name="suite.Old.time_parse",
        parameters={"problem_size": 100},
    )
    memory = replace(
        stored.run.measurements[0],
        benchmark_id=f"{stored.run.measurements[0].benchmark_id}:peak-memory",
        parameters={"size": 100},
    )
    stored = replace(stored, run=replace(stored.run, measurements=(imported, memory)))

    aliased = apply_aliases(
        (stored,),
        benchmarks={"suite.Old.time_parse": "tests/test_parse.py::test_parse"},
        parameters={"problem_size": "size"},
    )

    first, second = aliased[0].run.measurements
    assert first.benchmark_id == "tests/test_parse.py::test_parse|size=100"
    assert first.nodeid == "tests/test_parse.py::test_parse"
    assert first.name == "tests/test_parse.py::test_parse"
    assert first.parameters == {"size": 100}
    assert second == stored.run.measurements[1]


def test_aliases_rewrite_parametrized_nodeid_and_peak_memory_suffix():
    stored = _stored("run", "2026-01-01T00:00:00+00:00")
    memory = replace(stored.run.measurements[0], benchmark_id=f"{stored.run.measurements[0].benchmark_id}:peak-memory")
    stored = replace(stored, run=replace(stored.run, measurements=(*stored.run.measurements, memory)))

    aliased = apply_aliases((stored,), benchmarks={"tests/test_parse.py::test_parse": "tests/test_read.py::test_read"})

    first, second = aliased[0].run.measurements
    assert first.benchmark_id == "tests/test_read.py::test_read|size=100"
    assert first.nodeid == "tests/test_read.py::test_read[100]"
    assert second.benchmark_id == "tests/test_read.py::test_read|size=100:peak-memory"


def test_aliases_reject_collapsing_parameter_names():
    stored = _stored("run", "2026-01-01T00:00:00+00:00")
    measurement = replace(stored.run.measurements[0], parameters={"size": 100, "n": 100})
    stored = replace(stored, run=replace(stored.run, measurements=(measurement,)))

    with pytest.raises(QueryError, match="parameter aliases collapse distinct parameters"):
        apply_aliases((stored,), parameters={"size": "n"})
