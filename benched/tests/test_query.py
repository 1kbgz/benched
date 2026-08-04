from dataclasses import replace
from pathlib import Path

import pytest

from benched.model import load_run
from benched.query import QueryError, RunFilters, filter_measurements, filter_runs, resolve_selector
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
