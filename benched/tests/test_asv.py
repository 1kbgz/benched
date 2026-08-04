import json
from pathlib import Path

import pytest

from benched.asv import AsvIdentityOptions, AsvImportError, convert_asv_result, import_asv_results, infer_asv_identities, load_asv_config
from benched.cli import main
from benched.storage import read_runs


def _benchmarks():
    return {
        "bench.ParseSuite.time_parse": {
            "name": "bench.ParseSuite.time_parse",
            "param_names": ["size", "mode"],
            "params": [["10", "20"], ["'fast'", "'safe'"]],
            "type": "time",
            "unit": "seconds",
            "version": "benchmark-version",
        }
    }


def _result_v2():
    return {
        "commit_hash": "abcdef1234567890",
        "env_name": "virtualenv-py3.12",
        "date": 1_700_000_000_000,
        "params": {"machine": "ci", "arch": "x86_64", "os": "Linux", "python": "3.12", "csp": "0.14.0"},
        "python": "3.12",
        "requirements": {"csp": "0.14.0"},
        "env_vars": {},
        "result_columns": ["result", "params", "version", "started_at", "duration", "stats_q_25", "stats_q_75", "samples"],
        "results": {
            "bench.ParseSuite.time_parse": [
                [0.1, 0.2, 0.3, None],
                [["10", "20"], ["'fast'", "'safe'"]],
                "benchmark-version",
                1_700_000_001_000,
                1.5,
                [0.09, 0.19, 0.29, None],
                [0.11, 0.21, 0.31, None],
                [[0.09, 0.1, 0.11], [0.19, 0.2, 0.21], [0.29, 0.3, 0.31], None],
            ]
        },
        "version": 2,
    }


def _write_asv_results(root: Path) -> Path:
    results = root / "results"
    machine = results / "ci"
    machine.mkdir(parents=True)
    results.joinpath("benchmarks.json").write_text(json.dumps({**_benchmarks(), "version": 2}), encoding="utf-8")
    machine.joinpath("machine.json").write_text(
        json.dumps({"machine": "ci", "arch": "x86_64", "cpu": "example", "os": "Linux", "version": 1}), encoding="utf-8"
    )
    machine.joinpath("abcdef-virtualenv-py3.12.json").write_text(json.dumps(_result_v2()), encoding="utf-8")
    return results


def test_converts_asv_v2_parameter_axes_statistics_and_identity(tmp_path):
    source = tmp_path / "result.json"
    source.write_text(json.dumps(_result_v2()), encoding="utf-8")
    identities = AsvIdentityOptions(
        suite_name="csp-benchmarks",
        suite_repository="https://example.test/csp-benchmarks",
        subject_name="csp",
        subject_version_param="csp",
    )

    run = convert_asv_result(source, _benchmarks(), identities, machine_metadata={"cpu": "example", "ram": "15.76G"})

    assert run.run_id.startswith("asv-")
    assert run.started_at == "2023-11-14T22:13:21+00:00"
    assert run.ended_at == "2023-11-14T22:13:22.500000+00:00"
    assert run.suite.revision == "abcdef1234567890"
    assert run.subject.name == "csp"
    assert run.subject.version == "0.14.0"
    assert run.subject.revision is None
    assert run.environment.python_version == "3.12"
    assert run.machine.metadata["memory_gib"] == 16.0
    assert run.environment.labels["asv-param:csp"] == "0.14.0"
    assert len(run.measurements) == 4
    assert run.measurements[0].parameters == {"size": 10, "mode": "fast"}
    assert run.measurements[0].stats["mean"] == pytest.approx(0.1)
    assert run.measurements[0].stats["q25"] == 0.09
    assert run.measurements[0].samples == (0.09, 0.1, 0.11)
    assert run.measurements[-1].stats["median"] is None
    assert run.status == "success"
    assert run.provenance.source_checksum is not None
    assert run.provenance.source_checksum.startswith("sha256:")
    assert run.provenance.warnings == ("1 ASV measurements have no result",)


def test_converts_legacy_asv_v1_scalar_result(tmp_path):
    source = tmp_path / "machine" / "legacy.json"
    source.parent.mkdir()
    source.write_text(
        json.dumps(
            {
                "commit_hash": "abc123",
                "date": 1_700_000_000_000,
                "params": {"machine": "legacy", "arch": "arm64", "os": "macOS"},
                "python": "3.11",
                "requirements": {},
                "results": {"bench.mem_value": 255},
                "version": 1,
            }
        ),
        encoding="utf-8",
    )
    benchmarks = {"bench.mem_value": {"name": "bench.mem_value", "param_names": [], "params": [], "type": "memory", "unit": "bytes"}}

    run = convert_asv_result(source, benchmarks, AsvIdentityOptions(suite_name="legacy"))

    assert run.started_at == run.ended_at == "2023-11-14T22:13:20+00:00"
    assert run.subject.revision == "abc123"
    assert run.measurements[0].stats == {"median": 255.0, "mean": 255.0, "min": 255.0, "max": 255.0, "ops": None}
    assert run.provenance.warnings == ("ASV result has no benchmark timestamps; used the result date",)


def test_preserves_legacy_scalar_that_predates_parameter_grid(tmp_path):
    source = tmp_path / "machine" / "legacy.json"
    source.parent.mkdir()
    source.write_text(
        json.dumps(
            {
                "commit_hash": "abc123",
                "date": 1_700_000_000_000,
                "params": {"machine": "legacy"},
                "python": "2.7",
                "requirements": {},
                "results": {"bench.track_value": 42},
                "version": 1,
            }
        ),
        encoding="utf-8",
    )
    benchmarks = {
        "bench.track_value": {
            "name": "bench.track_value",
            "param_names": ["value"],
            "params": [["'a'", "'b'", "'c'"]],
            "type": "track",
            "unit": "unit",
        }
    }

    run = convert_asv_result(source, benchmarks, AsvIdentityOptions(suite_name="legacy"))

    assert len(run.measurements) == 1
    assert run.measurements[0].parameters == {}
    assert run.measurements[0].stats["median"] == 42
    assert "predates its parameter grid" in run.provenance.warnings[0]


def test_expands_failed_parameterized_asv_benchmark(tmp_path):
    source = tmp_path / "result.json"
    document = _result_v2()
    document["results"]["bench.ParseSuite.time_parse"][0] = None
    source.write_text(json.dumps(document), encoding="utf-8")

    run = convert_asv_result(source, _benchmarks(), AsvIdentityOptions(suite_name="suite"))

    assert len(run.measurements) == 4
    assert all(measurement.stats["median"] is None for measurement in run.measurements)
    assert run.status == "failed"


def test_import_is_idempotent_and_supports_dry_run(tmp_path):
    results = _write_asv_results(tmp_path)
    destination = str(tmp_path / "benched-results")
    identities = AsvIdentityOptions(suite_name="suite", subject_name="subject", subject_version_param="csp")

    first = import_asv_results(results, destination, identities)
    second = import_asv_results(results, destination, identities)
    dry_run = import_asv_results(results, str(tmp_path / "dry-run-results"), identities, dry_run=True)

    assert (first.converted, first.imported, first.skipped, first.ignored) == (1, 1, 0, 0)
    assert (second.converted, second.imported, second.skipped, second.ignored) == (1, 0, 1, 0)
    assert (dry_run.converted, dry_run.imported, dry_run.skipped, dry_run.ignored) == (1, 0, 0, 0)
    assert len(read_runs(destination)) == 1
    assert not (tmp_path / "dry-run-results").exists()


def test_import_ignores_stray_invalid_and_non_result_json(tmp_path):
    results = _write_asv_results(tmp_path)
    results.joinpath("ci", "invalid.json").write_text("{not JSON", encoding="utf-8")
    results.joinpath("ci", "metadata.json").write_text(json.dumps({"description": "not a result"}), encoding="utf-8")

    summary = import_asv_results(results, str(tmp_path / "destination"), AsvIdentityOptions(suite_name="suite"), dry_run=True)

    assert summary.converted == 1
    assert summary.ignored == 2
    assert len(summary.warnings) == 2


def test_infers_identity_from_commented_asv_config(tmp_path):
    results = _write_asv_results(tmp_path)
    tmp_path.joinpath("asv.conf.json").write_text(
        """{
  // ASV accepts comments and trailing commas.
  "project": "example-suite",
  "repo": "https://example.test/example-suite.git",
}
""",
        encoding="utf-8",
    )

    identities = infer_asv_identities(results, subject_name="dependency", subject_version_param="csp")

    assert identities.suite_name == "example-suite"
    assert identities.suite_repository == "https://example.test/example-suite.git"
    assert identities.subject_name == "dependency"
    assert identities.subject_repository is None
    assert load_asv_config(tmp_path / "asv.conf.json")["project"] == "example-suite"


def test_cli_imports_and_then_skips_existing_asv_results(tmp_path, capsys):
    results = _write_asv_results(tmp_path)
    destination = tmp_path / "history"
    arguments = [
        "import-asv",
        str(results),
        "--results-dir",
        str(destination),
        "--suite-name",
        "suite",
        "--subject-name",
        "csp",
        "--subject-version-param",
        "csp",
    ]

    assert main(arguments) == 0
    assert "imported 1 runs; skipped 0; ignored 0" in capsys.readouterr().out
    assert main(arguments) == 0
    assert "imported 0 runs; skipped 1; ignored 0" in capsys.readouterr().out


def test_import_cli_help_lists_identity_options(capsys):
    with pytest.raises(SystemExit) as error:
        main(["import-asv", "--help"])

    assert error.value.code == 0
    output = capsys.readouterr().out
    assert "--subject-version-param" in output
    assert "--dry-run" in output


def test_rejects_unsupported_asv_result_version(tmp_path):
    source = tmp_path / "result.json"
    source.write_text(json.dumps({**_result_v2(), "version": 3}), encoding="utf-8")

    with pytest.raises(AsvImportError, match="unsupported version 3"):
        convert_asv_result(source, _benchmarks(), AsvIdentityOptions(suite_name="suite"))
