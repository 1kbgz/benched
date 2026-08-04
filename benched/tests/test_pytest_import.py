import hashlib
import shutil
from pathlib import Path
from uuid import uuid4

import pytest

from benched.cli import main
from benched.pytest_import import PytestImportError, PytestImportOptions, convert_pytest_benchmark, import_pytest_benchmarks
from benched.storage import read_runs

FIXTURES = Path(__file__).with_name("fixtures")


def _source(tmp_path: Path) -> Path:
    source = tmp_path / "benchmark.json"
    shutil.copyfile(FIXTURES / "pytest-benchmark-v5.json", source)
    return source


def _identities() -> PytestImportOptions:
    return PytestImportOptions(
        suite_name="benchmark-suite",
        suite_repository="https://example.test/benchmarks",
        subject_name="example",
        subject_repository="https://example.test/example",
        subject_version="1.2.3",
        subject_revision="subject-abc",
    )


def test_converts_pytest_benchmark_history_with_source_identity(tmp_path):
    source = _source(tmp_path)

    run = convert_pytest_benchmark(source, _identities())

    assert run.run_id.startswith("pytest-")
    assert run.started_at == run.ended_at == "2026-08-03T22:15:00+00:00"
    assert run.suite.revision == "abc123"
    assert run.subject.name == "example"
    assert run.subject.version == "1.2.3"
    assert run.subject.revision == "subject-abc"
    assert run.machine.id == "ci"
    assert run.environment.python_version == "3.11.9"
    assert run.provenance.source_file == str(source)
    assert run.provenance.source_checksum == f"sha256:{hashlib.sha256(source.read_bytes()).hexdigest()}"
    assert len(run.measurements) == 1


def test_import_is_idempotent_supports_directories_fsspec_and_dry_run(tmp_path):
    source = _source(tmp_path)
    duplicate = tmp_path / "duplicate.json"
    shutil.copyfile(source, duplicate)
    destination = f"memory://benched-pytest-import-{uuid4().hex}/results"

    first = import_pytest_benchmarks((tmp_path,), destination, _identities())
    second = import_pytest_benchmarks((source,), destination, _identities())
    dry_run = import_pytest_benchmarks((source,), str(tmp_path / "dry-run"), _identities(), dry_run=True)

    assert (first.converted, first.imported, first.skipped) == (2, 1, 1)
    assert (second.converted, second.imported, second.skipped) == (1, 0, 1)
    assert (dry_run.converted, dry_run.imported, dry_run.skipped) == (1, 0, 0)
    assert len(read_runs(destination)) == 1
    assert not (tmp_path / "dry-run").exists()


def test_cli_imports_pytest_benchmark_history_and_skips_repeat(tmp_path, capsys):
    source = _source(tmp_path)
    destination = tmp_path / "results"
    arguments = [
        "import-pytest",
        str(source),
        "--results-dir",
        str(destination),
        "--suite-name",
        "benchmark-suite",
        "--subject-name",
        "example",
        "--subject-version",
        "1.2.3",
    ]

    assert main(arguments) == 0
    assert "imported 1 runs; skipped 0" in capsys.readouterr().out
    assert main(arguments) == 0
    assert "imported 0 runs; skipped 1" in capsys.readouterr().out


def test_import_cli_help_lists_identity_and_sample_options(capsys):
    with pytest.raises(SystemExit) as error:
        main(["import-pytest", "--help"])

    assert error.value.code == 0
    output = capsys.readouterr().out
    assert "--subject-revision" in output
    assert "--save-samples" in output
    assert "--dry-run" in output


def test_rejects_missing_or_invalid_pytest_benchmark_source(tmp_path):
    with pytest.raises(PytestImportError, match="source not found"):
        import_pytest_benchmarks((tmp_path / "missing.json",), str(tmp_path / "results"), _identities())

    source = tmp_path / "invalid.json"
    source.write_text("{}", encoding="utf-8")
    with pytest.raises(PytestImportError, match="machine_info"):
        convert_pytest_benchmark(source, _identities())
