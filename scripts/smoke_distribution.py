from __future__ import annotations

import argparse
import json
import subprocess
import sys
import tempfile
import textwrap
from pathlib import Path


def _run(arguments: list[str], *, cwd: Path, capture_output: bool = False) -> subprocess.CompletedProcess[str]:
    return subprocess.run(arguments, cwd=cwd, check=True, capture_output=capture_output, text=True)


def _environment_python(environment: Path) -> Path:
    return environment / ("Scripts/python.exe" if sys.platform == "win32" else "bin/python")


def _write_project(project: Path) -> None:
    benchmarks = project / "benchmarks"
    docs = project / "docs"
    benchmarks.mkdir()
    docs.mkdir()
    project.joinpath("pyproject.toml").write_text(
        textwrap.dedent(
            """
            [project]
            name = "benched-distribution-smoke"
            version = "1.0.0"

            [tool.benched]
            benchmark_paths = ["benchmarks"]
            results_dir = ".benched/results"

            [tool.pytest.ini_options]
            python_files = ["test_*.py"]
            """
        ).strip()
        + "\n",
        encoding="utf-8",
    )
    benchmarks.joinpath("test_smoke.py").write_text(
        textwrap.dedent(
            """
            from benched.query import RunFilters, filter_runs


            def test_filter_empty_history(benchmark):
                selected = benchmark(filter_runs, (), RunFilters())
                assert selected == ()
            """
        ).lstrip(),
        encoding="utf-8",
    )
    docs.joinpath("conf.py").write_text(
        'extensions = ["benched.sphinx"]\nproject = "Distribution smoke test"\n',
        encoding="utf-8",
    )
    docs.joinpath("index.rst").write_text(
        textwrap.dedent(
            """
            Distribution smoke test
            =======================

            .. benched:: ../.benched/results
               :view: trend
            """
        ).lstrip(),
        encoding="utf-8",
    )


def smoke(artifact: Path) -> None:
    with tempfile.TemporaryDirectory(prefix="benched-dist-") as temporary_directory:
        root = Path(temporary_directory)
        environment = root / "environment"
        project = root / "project"
        project.mkdir()
        _write_project(project)
        _run([sys.executable, "-m", "venv", str(environment)], cwd=root)
        python = _environment_python(environment)
        requirement = f"benched[sphinx] @ {artifact.resolve().as_uri()}"
        _run([str(python), "-m", "pip", "install", "--quiet", "--disable-pip-version-check", requirement], cwd=root)

        collected = _run([str(python), "-m", "benched", "list"], cwd=project, capture_output=True)
        if collected.stdout.strip() != "benchmarks/test_smoke.py::test_filter_empty_history":
            raise RuntimeError(f"unexpected collection output for {artifact.name}: {collected.stdout!r}")
        _run([str(python), "-m", "benched", "run", "--quick", "--machine", "distribution-smoke"], cwd=project)
        _run([str(python), "-m", "benched", "report", "--format", "html", "--output", "report"], cwd=project)
        _run([str(python), "-m", "sphinx", "-W", "-b", "html", "docs", "docs/_build"], cwd=project)

        report = json.loads(project.joinpath("report/data/report.json").read_text(encoding="utf-8"))
        if len(report["source_run_ids"]) != 1 or len(report["benchmarks"]) != 1:
            raise RuntimeError(f"unexpected report contents for {artifact.name}")
        required = (
            project / "report/index.html",
            project / "report/assets/benched.js",
            project / "report/assets/benched.css",
            project / "docs/_build/index.html",
            project / "docs/_build/_static/benched/benched.js",
            project / "docs/_build/_static/benched/benched.css",
        )
        missing = [str(path.relative_to(project)) for path in required if not path.is_file()]
        if missing:
            raise RuntimeError(f"missing installed artifacts for {artifact.name}: {', '.join(missing)}")
        print(f"passed installed smoke test: {artifact.name}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Smoke-test installed Benched distributions")
    parser.add_argument("artifacts", nargs="+", type=Path)
    options = parser.parse_args()
    for artifact in options.artifacts:
        smoke(artifact)


if __name__ == "__main__":
    main()
