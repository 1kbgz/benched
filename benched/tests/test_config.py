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


def test_rejects_invalid_benchmark_paths(tmp_path):
    pyproject = tmp_path / "pyproject.toml"
    pyproject.write_text('[tool.benched]\nbenchmark_paths = "benchmarks"\n', encoding="utf-8")

    with pytest.raises(ConfigError, match="benchmark_paths must be a non-empty array of strings"):
        load_config(pyproject, environ={})
