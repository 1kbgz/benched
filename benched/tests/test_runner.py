import os
from dataclasses import replace
from pathlib import Path
from types import SimpleNamespace

import pytest

from benched.config import load_config
from benched.hooks import create_plugin_manager, hookimpl
from benched.runner import RunnerError, collect_benchmarks, run_benchmarks
from benched.storage import read_runs


def _project(tmp_path: Path, benchmark_source: str) -> Path:
    pyproject = tmp_path / "pyproject.toml"
    pyproject.write_text(
        """
[project]
name = "runner-suite"
version = "0.4.0"

[tool.benched]
benchmark_paths = ["benchmarks"]
results_dir = "history"
""".strip(),
        encoding="utf-8",
    )
    benchmarks = tmp_path / "benchmarks"
    benchmarks.mkdir()
    (benchmarks / "test_speed.py").write_text(benchmark_source, encoding="utf-8")
    return pyproject


def test_runs_parameterized_benchmarks_and_saves_history(tmp_path):
    pyproject = _project(
        tmp_path,
        """
import pytest

@pytest.mark.parametrize("size", [1, 3])
def test_length(benchmark, size):
    assert benchmark(len, list(range(size))) == size
""".strip(),
    )
    config = load_config(pyproject, environ={})

    first = run_benchmarks(config, quick=True)
    second = run_benchmarks(config, ("-k", "3"), quick=True)

    assert first.exit_code == second.exit_code == 0
    assert first.run is not None
    assert len(first.run.measurements) == 4
    assert second.run is not None
    assert len(second.run.measurements) == 2
    assert {measurement.parameters["size"] for measurement in first.run.measurements} == {1, 3}
    assert len([measurement for measurement in first.run.measurements if measurement.unit == "bytes"]) == 2
    assert all(measurement.stats["peak_memory"] > 0 for measurement in first.run.measurements if measurement.unit == "bytes")
    assert all(measurement.samples is None for measurement in first.run.measurements)
    assert first.run.suite.name == "runner-suite"
    assert first.run.subject.name == "runner-suite"
    assert first.location != second.location
    assert len(read_runs(config.results_dir)) == 2


def test_runs_pedantic_benchmark_and_keeps_requested_samples(tmp_path):
    pyproject = _project(
        tmp_path,
        """
def test_sum(benchmark):
    result = benchmark.pedantic(sum, args=([1, 2],), rounds=2, iterations=1)
    assert result == 3
""".strip(),
    )
    config = load_config(pyproject, environ={})

    result = run_benchmarks(config, save_samples=True, no_save=True)

    assert result.exit_code == 0
    assert result.location is None
    assert result.run is not None
    assert result.run.measurements[0].stats["rounds"] == 2
    assert len(result.run.measurements[0].samples or ()) == 2
    assert result.run.measurements[1].unit == "bytes"
    assert result.run.measurements[1].stats["peak_memory"] > 0


def test_applies_configured_environment_to_benchmark_subprocess(tmp_path, monkeypatch):
    pyproject = _project(
        tmp_path,
        """
import os

def test_environment(benchmark):
    assert os.environ["OMP_NUM_THREADS"] == "1"
    assert os.environ["EMPTY_VALUE"] == ""
    benchmark(len, [1])
""".strip(),
    )
    with pyproject.open("a", encoding="utf-8") as file:
        file.write('\n\n[tool.benched.env]\nOMP_NUM_THREADS = "1"\nEMPTY_VALUE = ""\n')
    monkeypatch.setenv("OMP_NUM_THREADS", "8")
    config = load_config(pyproject, environ={})

    result = run_benchmarks(config, quick=True, no_save=True)

    assert result.exit_code == 0
    assert os.environ["OMP_NUM_THREADS"] == "8"
    assert "EMPTY_VALUE" not in os.environ


def test_preserves_partial_failed_run(tmp_path):
    pyproject = _project(
        tmp_path,
        """
def test_passes(benchmark):
    assert benchmark(len, [1]) == 1

def test_fails(benchmark):
    benchmark(len, [1])
    assert False
""".strip(),
    )
    config = load_config(pyproject, environ={})

    result = run_benchmarks(config, quick=True)

    assert result.exit_code == 1
    assert result.run is not None
    assert result.run.status == "failed"
    assert [measurement.name for measurement in result.run.measurements] == [
        "test_passes",
        "test_passes peak memory",
        "test_fails",
        "test_fails peak memory",
    ]
    assert len(read_runs(config.results_dir)) == 1


def test_collects_benchmarks_without_running_them(tmp_path):
    marker = tmp_path / "called"
    pyproject = _project(
        tmp_path,
        f"""
def work():
    open({str(marker)!r}, "w").close()

def test_speed(benchmark):
    benchmark(work)

def test_ordinary():
    pass
""".strip(),
    )
    config = load_config(pyproject, environ={})

    exit_code, nodeids = collect_benchmarks(config)

    assert exit_code == 0
    assert nodeids == ("benchmarks/test_speed.py::test_speed",)
    assert not marker.exists()


def test_applies_configured_environment_while_collecting(tmp_path):
    pyproject = _project(
        tmp_path,
        """
import os

assert os.environ["BENCHED_IMPORT_STATE"] == "ready"

def test_speed(benchmark):
    benchmark(len, [1])
""".strip(),
    )
    with pyproject.open("a", encoding="utf-8") as file:
        file.write('\n\n[tool.benched.env]\nBENCHED_IMPORT_STATE = "ready"\n')
    config = load_config(pyproject, environ={})

    exit_code, nodeids = collect_benchmarks(config)

    assert exit_code == 0
    assert nodeids == ("benchmarks/test_speed.py::test_speed",)


def test_run_hooks_enrich_before_store_and_observe_location(tmp_path):
    pyproject = _project(
        tmp_path,
        """
import os

def test_speed(benchmark):
    assert os.environ["BENCHED_HOOK_STATE"] == "ready"
    benchmark(len, [1])
""".strip(),
    )
    config = load_config(pyproject, environ={})
    calls = []

    class Plugin:
        @hookimpl
        def benched_before_benchmark(self, context):
            calls.append("before")
            context.environment["BENCHED_HOOK_STATE"] = "ready"

        @hookimpl
        def benched_after_benchmark(self, context):
            calls.append("after")
            assert context.exit_code == 0
            assert context.run is not None
            assert context.raw_path.is_file()
            assert context.error is None

        @hookimpl
        def benched_enrich_run(self, context):
            calls.append("enrich")
            context.run = replace(context.run, subject=replace(context.run.subject, labels={"build": "optimized"}))

        @hookimpl
        def benched_after_store(self, context):
            calls.append("store")
            assert context.location is not None

    manager = create_plugin_manager(load_entrypoints=False)
    manager.register(Plugin(), name="run-plugin")

    result = run_benchmarks(config, quick=True, plugin_manager=manager)

    assert calls == ["before", "after", "enrich", "store"]
    assert result.run is not None
    assert result.run.subject.labels == {"build": "optimized"}
    assert read_runs(config.results_dir)[0].run.subject.labels == {"build": "optimized"}


def test_after_benchmark_runs_when_pytest_produces_no_data(tmp_path, monkeypatch):
    config = load_config(_project(tmp_path, "def test_speed(benchmark): benchmark(len, [1])"), environ={})
    observed = []

    class Plugin:
        @hookimpl
        def benched_after_benchmark(self, context):
            observed.append(context)

    monkeypatch.setattr("benched.runner.subprocess.run", lambda *args, **kwargs: SimpleNamespace(returncode=5))
    manager = create_plugin_manager(load_entrypoints=False)
    manager.register(Plugin(), name="cleanup")

    result = run_benchmarks(config, plugin_manager=manager)

    assert result.exit_code == 5
    assert result.run is None
    assert len(observed) == 1
    assert observed[0].exit_code == 5
    assert observed[0].run is None
    assert observed[0].error is None


def test_after_benchmark_observes_normalization_errors(tmp_path, monkeypatch):
    config = load_config(_project(tmp_path, "def test_speed(benchmark): benchmark(len, [1])"), environ={})
    observed = []

    class Plugin:
        @hookimpl
        def benched_after_benchmark(self, context):
            observed.append(context)

    def invalid_result(arguments, **kwargs):
        outputs = [argument.removeprefix("--benchmark-json=") for argument in arguments if argument.startswith("--benchmark-json=")]
        if not outputs:
            return SimpleNamespace(returncode=1, stdout="", stderr="")
        output = outputs[0]
        Path(output).write_text("{}", encoding="utf-8")
        return SimpleNamespace(returncode=0)

    monkeypatch.setattr("benched.runner.subprocess.run", invalid_result)
    manager = create_plugin_manager(load_entrypoints=False)
    manager.register(Plugin(), name="cleanup")

    with pytest.raises(RunnerError, match="invalid benchmark data"):
        run_benchmarks(config, plugin_manager=manager)

    assert len(observed) == 1
    assert observed[0].exit_code == 0
    assert observed[0].run is None
    assert isinstance(observed[0].error, RunnerError)
