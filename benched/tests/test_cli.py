import json
import subprocess
import sys
from dataclasses import replace
from pathlib import Path

from benched.cli import main
from benched.model import load_run
from benched.storage import save_run

FIXTURES = Path(__file__).with_name("fixtures")


def _pyproject(tmp_path: Path) -> Path:
    pyproject = tmp_path / "pyproject.toml"
    pyproject.write_text(
        f"""
[project]
name = "cli-suite"

[tool.benched]
results_dir = {str(tmp_path / "results")!r}
""".strip(),
        encoding="utf-8",
    )
    return pyproject


def _save_comparison_run(tmp_path: Path, run_id: str, ended_at: str, median: float, **changes):
    source = load_run(FIXTURES / "canonical-run-v1.json")
    measurement = replace(source.measurements[0], stats={"median": median})
    run = replace(source, run_id=run_id, ended_at=ended_at, measurements=(measurement,), **changes)
    save_run(str(tmp_path / "results"), run)
    return run


def test_history_and_show_saved_runs(tmp_path, capsys):
    pyproject = _pyproject(tmp_path)
    run = replace(load_run(FIXTURES / "canonical-run-v1.json"), run_id="unique-run-id")
    save_run(str(tmp_path / "results"), run)

    assert main(["history", "--pyproject", str(pyproject)]) == 0
    assert "unique-run-id" in capsys.readouterr().out

    assert main(["show", "unique", "--pyproject", str(pyproject)]) == 0
    output = json.loads(capsys.readouterr().out)
    assert output["run_id"] == "unique-run-id"


def test_invalid_label_is_actionable(tmp_path, capsys):
    pyproject = _pyproject(tmp_path)

    assert main(["run", "--pyproject", str(pyproject), "--subject-label", "invalid"]) == 2
    assert "label must use KEY=VALUE" in capsys.readouterr().err


def test_compare_latest_and_previous_with_regression_gate(tmp_path, capsys):
    pyproject = _pyproject(tmp_path)
    _save_comparison_run(tmp_path, "base-run", "2026-01-01T00:00:00+00:00", 10.0)
    _save_comparison_run(tmp_path, "head-run", "2026-01-02T00:00:00+00:00", 12.0)

    exit_code = main(["compare", "previous", "latest", "--fail-if", "median:10%", "--pyproject", str(pyproject)])

    output = capsys.readouterr().out
    assert exit_code == 1
    assert "base base-run  head head-run  metric median" in output
    assert "regressed" in output


def test_compare_context_mismatch_has_distinct_exit_code(tmp_path, capsys):
    pyproject = _pyproject(tmp_path)
    base = _save_comparison_run(tmp_path, "base-run", "2026-01-01T00:00:00+00:00", 10.0)
    machine = replace(base.machine, id="other", fingerprint="different")
    _save_comparison_run(tmp_path, "head-run", "2026-01-02T00:00:00+00:00", 9.0, machine=machine)

    assert main(["compare", "base", "head", "--pyproject", str(pyproject)]) == 3
    assert "machine fingerprint differs" in capsys.readouterr().err

    assert main(["compare", "base", "head", "--allow-mismatch", "--pyproject", str(pyproject)]) == 0
    assert "warning: machine fingerprint differs" in capsys.readouterr().err


def test_compare_failed_run_has_distinct_exit_code(tmp_path, capsys):
    pyproject = _pyproject(tmp_path)
    _save_comparison_run(tmp_path, "base-run", "2026-01-01T00:00:00+00:00", 10.0)
    _save_comparison_run(tmp_path, "failed-run", "2026-01-02T00:00:00+00:00", 12.0, status="failed", exit_code=1)

    assert main(["compare", "base", "failed", "--pyproject", str(pyproject)]) == 4
    assert "unsuccessful run: failed-run" in capsys.readouterr().err


def test_history_filters_runs_and_measurements(tmp_path, capsys):
    pyproject = _pyproject(tmp_path)
    first = _save_comparison_run(tmp_path, "first-run", "2026-01-01T00:00:00+00:00", 10.0)
    machine = replace(first.machine, id="workstation")
    _save_comparison_run(tmp_path, "second-run", "2026-01-02T00:00:00+00:00", 12.0, machine=machine)

    assert main(["history", "--machine", "workstation", "--parameter", "size=100", "--pyproject", str(pyproject)]) == 0
    output = capsys.readouterr().out
    assert "second-run" in output
    assert "first-run" not in output


def test_cli_subprocess_preserves_compare_exit_codes(tmp_path):
    pyproject = _pyproject(tmp_path)
    _save_comparison_run(tmp_path, "base-run", "2026-01-01T00:00:00+00:00", 10.0)
    _save_comparison_run(tmp_path, "head-run", "2026-01-02T00:00:00+00:00", 12.0)
    _save_comparison_run(tmp_path, "failed-run", "2026-01-03T00:00:00+00:00", 12.0, status="failed", exit_code=1)
    command = [sys.executable, "-m", "benched", "compare"]
    config = ["--pyproject", str(pyproject)]

    regression = subprocess.run([*command, "base", "head", "--fail-if", "10%", *config], check=False)
    usage = subprocess.run([*command, "missing", "head", *config], check=False)
    benchmark_failure = subprocess.run([*command, "base", "failed", *config], check=False)

    assert regression.returncode == 1
    assert usage.returncode == 2
    assert benchmark_failure.returncode == 4


def test_report_writes_json_and_static_html_from_latest_success(tmp_path, capsys):
    pyproject = _pyproject(tmp_path)
    _save_comparison_run(tmp_path, "base-run", "2026-01-01T00:00:00+00:00", 10.0)
    _save_comparison_run(tmp_path, "head-run", "2026-01-02T00:00:00+00:00", 9.0)
    _save_comparison_run(tmp_path, "failed-run", "2026-01-03T00:00:00+00:00", 8.0, status="failed", exit_code=1)
    output = tmp_path / "site"

    exit_code = main(
        [
            "report",
            "--latest",
            "1",
            "--format",
            "json",
            "--format",
            "html",
            "--output",
            str(output),
            "--pyproject",
            str(pyproject),
        ]
    )

    assert exit_code == 0
    assert json.loads((output / "report.json").read_text(encoding="utf-8"))["source_run_ids"] == ["head-run"]
    assert json.loads((output / "data/report.json").read_text(encoding="utf-8"))["source_run_ids"] == ["head-run"]
    assert (output / "index.html").is_file()
    assert (output / "assets/benched.js").is_file()
    assert "wrote html" in capsys.readouterr().out


def test_report_coalesces_latest_measurement_per_benchmark(tmp_path, capsys):
    pyproject = _pyproject(tmp_path)
    old = _save_comparison_run(tmp_path, "old-run", "2026-01-01T00:00:00+00:00", 10.0)
    second = replace(old.measurements[0], benchmark_id="second", name="second", stats={"median": 20.0})
    save_run(str(tmp_path / "results"), replace(old, run_id="old-complete", measurements=(*old.measurements, second)))
    _save_comparison_run(tmp_path, "new-partial", "2026-01-02T00:00:00+00:00", 9.0)
    output = tmp_path / "coalesced"

    exit_code = main(
        [
            "report",
            "--latest-per-benchmark",
            "--format",
            "json",
            "--output",
            str(output),
            "--pyproject",
            str(pyproject),
        ]
    )

    report = json.loads((output / "report.json").read_text(encoding="utf-8"))
    assert exit_code == 0
    assert report["source_run_ids"] == ["old-complete", "new-partial"]
    assert {benchmark["benchmark_id"] for benchmark in report["benchmarks"]} == {old.measurements[0].benchmark_id, "second"}
    assert all(len(benchmark["series"]) == 1 for benchmark in report["benchmarks"])

    assert main(["report", "--latest-per-benchmark", "--latest", "1", "--pyproject", str(pyproject)]) == 2
    assert "cannot be combined with --latest" in capsys.readouterr().err


def test_report_preset_supplies_benchmark_metric_and_selection(tmp_path, capsys):
    pyproject = tmp_path / "pyproject.toml"
    pyproject.write_text(
        f"""
[project]
name = "cli-suite"

[tool.benched]
results_dir = {str(tmp_path / "results")!r}

[tool.benched.reports.parse]
benchmark = "*test_parse*"
metric = "mean"
latest = 1
""".strip(),
        encoding="utf-8",
    )
    _save_comparison_run(tmp_path, "old-run", "2026-01-01T00:00:00+00:00", 10.0)
    _save_comparison_run(tmp_path, "new-run", "2026-01-02T00:00:00+00:00", 9.0)
    output = tmp_path / "preset"

    exit_code = main(
        ["report", "--preset", "parse", "--format", "terminal", "--format", "json", "--output", str(output), "--pyproject", str(pyproject)]
    )

    report = json.loads((output / "report.json").read_text(encoding="utf-8"))
    assert exit_code == 0
    assert report["source_run_ids"] == ["new-run"]
    assert "metric mean" in capsys.readouterr().out

    assert main(["report", "--preset", "missing", "--pyproject", str(pyproject)]) == 2
    assert "unknown report preset 'missing'; available: parse" in capsys.readouterr().err


def test_compare_baseline_reports_within_run_ratios(tmp_path, capsys):
    pyproject = _pyproject(tmp_path)
    source = load_run(FIXTURES / "canonical-run-v1.json")
    template = source.measurements[0]
    measurements = tuple(
        replace(
            template,
            benchmark_id=f"tests/test_solve.py::test_solve|size=10&solver=%22{solver}%22",
            parameters={"solver": solver, "size": 10},
            stats={"median": median},
        )
        for solver, median in (("mosek", 1.0), ("internal", 3.0))
    )
    save_run(str(tmp_path / "results"), replace(source, run_id="solver-run", measurements=measurements))

    exit_code = main(["compare", "latest", "--baseline", "solver=mosek", "--pyproject", str(pyproject)])

    output = capsys.readouterr().out
    assert exit_code == 0
    assert "run solver-run  baseline solver=mosek  metric median" in output
    assert "regressed" in output

    assert main(["compare", "latest", "previous", "--baseline", "solver=mosek", "--pyproject", str(pyproject)]) == 2
    assert "within a single run" in capsys.readouterr().err


def test_export_writes_csv_with_parameter_columns(tmp_path, capsys):
    pyproject = _pyproject(tmp_path)
    _save_comparison_run(tmp_path, "run-a", "2026-01-01T00:00:00+00:00", 10.0)
    _save_comparison_run(tmp_path, "run-b", "2026-01-02T00:00:00+00:00", 9.0)
    output = tmp_path / "history.csv"

    exit_code = main(["export", "--output", str(output), "--pyproject", str(pyproject)])

    lines = output.read_text(encoding="utf-8").splitlines()
    assert exit_code == 0
    assert "wrote csv" in capsys.readouterr().out
    assert lines[0].startswith("run_id,")
    assert ",size," in lines[0]
    assert len(lines) == 3


def test_compact_archives_history_and_keeps_it_queryable(tmp_path, capsys):
    pyproject = _pyproject(tmp_path)
    _save_comparison_run(tmp_path, "run-a", "2026-01-01T00:00:00+00:00", 10.0)
    _save_comparison_run(tmp_path, "run-b", "2026-01-02T00:00:00+00:00", 9.0)

    assert main(["compact", "--keep", "1", "--pyproject", str(pyproject)]) == 0
    assert "archived 1 runs into" in capsys.readouterr().out

    assert main(["history", "--pyproject", str(pyproject)]) == 0
    output = capsys.readouterr().out
    assert "run-a" in output
    assert "run-b" in output

    assert main(["compact", "--keep", "1", "--pyproject", str(pyproject)]) == 0
    assert "nothing to compact" in capsys.readouterr().out


def test_aliases_unify_renamed_benchmark_history(tmp_path, capsys):
    pyproject = tmp_path / "pyproject.toml"
    pyproject.write_text(
        f"""
[project]
name = "cli-suite"

[tool.benched]
results_dir = {str(tmp_path / "results")!r}

[tool.benched.aliases.benchmarks]
"suite.Old.time_parse" = "tests/test_parse.py::test_parse"

[tool.benched.aliases.parameters]
problem_size = "size"
""".strip(),
        encoding="utf-8",
    )
    old = _save_comparison_run(tmp_path, "imported-run", "2026-01-01T00:00:00+00:00", 10.0)
    renamed = replace(
        old.measurements[0],
        benchmark_id="suite.Old.time_parse|problem_size=100",
        nodeid="suite.Old.time_parse",
        name="suite.Old.time_parse",
        parameters={"problem_size": 100},
    )
    save_run(str(tmp_path / "results"), replace(old, run_id="asv-run", ended_at="2025-12-01T00:00:00+00:00", measurements=(renamed,)))
    output = tmp_path / "aliased"

    exit_code = main(["report", "--format", "json", "--output", str(output), "--pyproject", str(pyproject)])

    report = json.loads((output / "report.json").read_text(encoding="utf-8"))
    assert exit_code == 0
    assert [benchmark["benchmark_id"] for benchmark in report["benchmarks"]] == ["tests/test_parse.py::test_parse|size=100"]
    assert [point["run_id"] for point in report["benchmarks"][0]["series"]] == ["asv-run", "imported-run"]
