from pathlib import Path

import pytest

from benched.config import ConfigError, load_config


def _write_pyproject(path: Path) -> Path:
    pyproject = path / "pyproject.toml"
    pyproject.write_text(
        """
[project]
name = "example-benchmarks"
version = "0.3.0"

[project.urls]
Repository = "https://example.test/example-benchmarks"

[tool.benched]
benchmark_paths = ["performance"]
results_dir = "history"

[tool.benched.subject]
name = "example"
distribution = "example-package"
repository = "https://example.test/example"
""".strip(),
        encoding="utf-8",
    )
    return pyproject


def test_loads_project_and_benched_defaults(tmp_path):
    config = load_config(_write_pyproject(tmp_path), environ={})

    assert config.project_root == tmp_path
    assert config.benchmark_paths == (tmp_path / "performance",)
    assert config.results_dir == str(tmp_path / "history")
    assert config.storage_options == {}
    assert config.project_version == "0.3.0"
    assert config.suite.name == "example-benchmarks"
    assert config.suite.repository == "https://example.test/example-benchmarks"
    assert config.subject.name == "example"
    assert config.subject.distribution == "example-package"


def test_precedence_is_override_environment_toml_inferred(tmp_path):
    config = load_config(
        _write_pyproject(tmp_path),
        environ={"BENCHED_RESULTS_DIR": "environment", "BENCHED_SUBJECT_NAME": "environment-subject"},
        overrides={"results_dir": "override", "subject": {"name": "override-subject"}},
    )

    assert config.results_dir == str(tmp_path / "override")
    assert config.subject.name == "override-subject"
    assert config.subject.distribution == "example-package"


def test_infers_configuration_without_pyproject(tmp_path):
    config = load_config(start=tmp_path, environ={})

    assert config.pyproject is None
    assert config.suite.name == tmp_path.name
    assert config.subject.name == tmp_path.name
    assert config.benchmark_paths == (tmp_path / "benchmarks",)
    assert config.results_dir == str(tmp_path / ".benched/results")


def test_preserves_fsspec_url_and_options(tmp_path):
    pyproject = tmp_path / "pyproject.toml"
    pyproject.write_text(
        """
[tool.benched]
results_dir = "memory://benchmarks/results"

[tool.benched.storage_options]
auto_mkdir = true
""".strip(),
        encoding="utf-8",
    )

    config = load_config(pyproject, environ={})

    assert config.results_dir == "memory://benchmarks/results"
    assert config.storage_options == {"auto_mkdir": True}


def test_loads_benchmark_subprocess_environment(tmp_path):
    pyproject = tmp_path / "pyproject.toml"
    pyproject.write_text(
        '[tool.benched.env]\nOMP_NUM_THREADS = "1"\nEMPTY_VALUE = ""\n',
        encoding="utf-8",
    )

    config = load_config(pyproject, environ={})

    assert config.env == {"OMP_NUM_THREADS": "1", "EMPTY_VALUE": ""}


def test_rejects_non_string_benchmark_environment_values(tmp_path):
    pyproject = tmp_path / "pyproject.toml"
    pyproject.write_text("[tool.benched.env]\nOMP_NUM_THREADS = 1\n", encoding="utf-8")

    with pytest.raises(ConfigError, match=r"tool\.benched\.env values must be strings"):
        load_config(pyproject, environ={})


def test_rejects_invalid_benchmark_paths(tmp_path):
    pyproject = tmp_path / "pyproject.toml"
    pyproject.write_text('[tool.benched]\nbenchmark_paths = "benchmarks"\n', encoding="utf-8")

    with pytest.raises(ConfigError, match="benchmark_paths must be a non-empty array of strings"):
        load_config(pyproject, environ={})


def test_loads_aliases_and_report_presets(tmp_path):
    pyproject = tmp_path / "pyproject.toml"
    pyproject.write_text(
        """
[tool.benched.aliases.benchmarks]
"suite.Old.time_solve" = "tests/test_solver.py::test_solve"

[tool.benched.aliases.parameters]
problem_size = "n_assets"

[tool.benched.reports.solver]
benchmark = "*test_solver*"
metric = "median"
view = "trend"
latest_per_benchmark = true

[tool.benched.reports.recent]
latest = 5
""".strip(),
        encoding="utf-8",
    )

    config = load_config(pyproject, environ={})

    assert config.aliases.benchmarks == {"suite.Old.time_solve": "tests/test_solver.py::test_solve"}
    assert config.aliases.parameters == {"problem_size": "n_assets"}
    assert config.reports["solver"].benchmark == "*test_solver*"
    assert config.reports["solver"].metric == "median"
    assert config.reports["solver"].view == "trend"
    assert config.reports["solver"].latest_per_benchmark is True
    assert config.reports["recent"].latest == 5
    assert config.reports["recent"].latest_per_benchmark is False


@pytest.mark.parametrize(
    ("table", "message"),
    [
        ("[tool.benched.aliases.machines]\nold = 'new'", r"unknown tool\.benched\.aliases keys: machines"),
        ("[tool.benched.aliases.benchmarks]\nold = 1", r"tool\.benched\.aliases\.benchmarks keys and values must be non-empty strings"),
        ("[tool.benched.reports.solver]\nglob = '*'", r"unknown tool\.benched\.reports\.solver keys: glob"),
        ("[tool.benched.reports.solver]\nmetric = 'p99'", r"tool\.benched\.reports\.solver\.metric must be one of"),
        ("[tool.benched.reports.solver]\nview = 'grid'", r"tool\.benched\.reports\.solver\.view must be one of"),
        ("[tool.benched.reports.solver]\nlatest = 0", r"tool\.benched\.reports\.solver\.latest must be a positive integer"),
        (
            "[tool.benched.reports.solver]\nlatest = 2\nlatest_per_benchmark = true",
            r"cannot combine latest with latest_per_benchmark",
        ),
    ],
)
def test_rejects_invalid_aliases_and_presets(tmp_path, table, message):
    pyproject = tmp_path / "pyproject.toml"
    pyproject.write_text(table, encoding="utf-8")

    with pytest.raises(ConfigError, match=message):
        load_config(pyproject, environ={})
