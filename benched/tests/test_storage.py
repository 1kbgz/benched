from dataclasses import replace
from pathlib import Path
from uuid import uuid4

import pytest

from benched.model import load_run
from benched.storage import StorageError, compact_runs, read_runs, resolve_run, save_run

FIXTURES = Path(__file__).with_name("fixtures")


def _run(run_id="run-001"):
    return replace(load_run(FIXTURES / "canonical-run-v1.json"), run_id=run_id)


def test_saves_pretty_immutable_local_run(tmp_path):
    location = save_run(str(tmp_path), _run())

    stored_path = Path(location.removeprefix("file://"))
    assert stored_path.is_file()
    assert stored_path.read_text(encoding="utf-8").endswith("\n")
    assert read_runs(str(tmp_path))[0].run == _run()
    with pytest.raises(StorageError, match="run already exists"):
        save_run(str(tmp_path), _run())


def test_uses_any_installed_fsspec_backend():
    url = f"memory://benched-tests-{uuid4().hex}/results"

    first = save_run(url, _run("first-run"))
    second = save_run(url, _run("second-run"))

    assert first.startswith("memory://")
    assert second.startswith("memory://")
    assert [stored.run.run_id for stored in read_runs(url)] == ["first-run", "second-run"]
    assert resolve_run(url, "second").run.run_id == "second-run"


def test_rejects_ambiguous_run_prefix():
    url = f"memory://benched-tests-{uuid4().hex}/results"
    save_run(url, _run("shared-one"))
    save_run(url, _run("shared-two"))

    with pytest.raises(StorageError, match="ambiguous"):
        resolve_run(url, "shared")


def test_missing_fsspec_backend_is_actionable():
    with pytest.raises(StorageError, match="cannot initialize results store"):
        read_runs("missing-backend://results")


def _dated_run(run_id: str, ended_at: str):
    return replace(_run(run_id), ended_at=ended_at)


def test_compact_archives_older_runs_and_preserves_history(tmp_path):
    url = str(tmp_path)
    for index in range(4):
        save_run(url, _dated_run(f"run-{index}", f"2026-01-0{index + 1}T00:00:00+00:00"))

    archived, location = compact_runs(url, keep=2)

    assert archived == 2
    assert location.endswith("archive.json.gz")
    stored = sorted(read_runs(url), key=lambda item: item.run.ended_at)
    assert [item.run.run_id for item in stored] == ["run-0", "run-1", "run-2", "run-3"]
    assert [item.location.endswith(".json.gz") for item in stored] == [True, True, False, False]
    assert len(list(tmp_path.rglob("*.json"))) == 2

    assert compact_runs(url, keep=2) == (0, location)

    archived, _ = compact_runs(url, keep=1)
    assert archived == 1
    stored = sorted(read_runs(url), key=lambda item: item.run.ended_at)
    assert [item.run.run_id for item in stored] == ["run-0", "run-1", "run-2", "run-3"]
    assert [item.location.endswith(".json.gz") for item in stored] == [True, True, True, False]


def test_compact_keep_zero_archives_everything(tmp_path):
    url = str(tmp_path)
    save_run(url, _dated_run("only", "2026-01-01T00:00:00+00:00"))

    archived, _ = compact_runs(url, keep=0)

    assert archived == 1
    assert list(tmp_path.rglob("*.json")) == []
    assert [item.run.run_id for item in read_runs(url)] == ["only"]
