from pathlib import Path

from benched.config import load_config
from benched.runner import run_benchmarks
from benched.storage import read_runs


def _project(tmp_path: Path, configuration: str, benchmark_source: str) -> Path:
    pyproject = tmp_path / "pyproject.toml"
    pyproject.write_text(configuration.strip(), encoding="utf-8")
    benchmarks = tmp_path / "benchmarks"
    benchmarks.mkdir()
    (benchmarks / "test_workflow.py").write_text(benchmark_source.strip(), encoding="utf-8")
    return pyproject


def test_laxate_style_current_environment_run_writes_mounted_history(tmp_path):
    results = tmp_path / "mounted-results"
    pyproject = _project(
        tmp_path,
        """
[project]
name = "laxate"
version = "0.1.0"

[tool.benched]
benchmark_paths = ["benchmarks"]
results_dir = "unused"
""",
        """
import pytest


@pytest.fixture
def values():
    return list(range(100))


@pytest.mark.parametrize("iterations", [10, 100])
def test_compute(benchmark, values, iterations):
    def compute():
        return sum(values) * iterations

    assert benchmark(compute) == 4950 * iterations
""",
    )
    config = load_config(pyproject, environ={}, overrides={"results_dir": str(results)})

    result = run_benchmarks(config, quick=True, machine_id="hetzner-cx23")

    assert result.exit_code == 0
    assert result.run is not None
    assert result.run.suite.name == result.run.subject.name == "laxate"
    assert result.run.machine.id == "hetzner-cx23"
    assert {measurement.parameters["iterations"] for measurement in result.run.measurements} == {10, 100}
    assert len(read_runs(str(results))) == 1


def test_csp_style_suite_keeps_installed_subject_identity_separate(tmp_path):
    pyproject = _project(
        tmp_path,
        """
[project]
name = "csp-benchmarks"
version = "0.1.0"

[tool.benched]
benchmark_paths = ["benchmarks"]
results_dir = "results"

[tool.benched.suite]
name = "csp-benchmarks"
repository = "https://github.com/csp-community/csp-benchmarks"

[tool.benched.subject]
name = "csp"
distribution = "csp"
repository = "https://github.com/Point72/csp"
""",
        """
import pytest


@pytest.fixture
def graph_inputs(num_nodes, num_ticks):
    return list(range(num_nodes)), num_ticks


@pytest.mark.benchmark(group="core")
@pytest.mark.parametrize("num_nodes", [10, 100])
@pytest.mark.parametrize("num_ticks", [5, 20])
def test_linear_graph(benchmark, graph_inputs):
    nodes, num_ticks = graph_inputs

    def execute():
        return sum(nodes) * num_ticks

    assert benchmark(execute) == sum(nodes) * num_ticks
""",
    )
    config = load_config(pyproject, environ={})

    result = run_benchmarks(
        config,
        quick=True,
        suite_revision="suite-abc123",
        subject_version="2.10.0",
        subject_revision="csp-def456",
        machine_id="github-actions",
    )

    assert result.exit_code == 0
    assert result.run is not None
    assert result.run.suite.name == "csp-benchmarks"
    assert result.run.suite.revision == "suite-abc123"
    assert result.run.subject.name == "csp"
    assert result.run.subject.version == "2.10.0"
    assert result.run.subject.revision == "csp-def456"
    assert result.run.machine.id == "github-actions"
    assert len(result.run.measurements) == 8
    assert {measurement.group for measurement in result.run.measurements} == {"core"}
    assert {(measurement.parameters["num_ticks"], measurement.parameters["num_nodes"]) for measurement in result.run.measurements} == {
        (5, 10),
        (5, 100),
        (20, 10),
        (20, 100),
    }
