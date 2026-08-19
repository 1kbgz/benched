from __future__ import annotations

import os
import tomllib
from collections.abc import Mapping
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any


class ConfigError(ValueError):
    """Raised when Benched configuration is malformed."""


_PRESET_METRICS = ("median", "mean", "min", "max", "ops", "peak_memory")
_PRESET_VIEWS = ("overview", "trend", "comparison")


@dataclass(frozen=True, slots=True)
class IdentityConfig:
    name: str
    repository: str | None = None
    distribution: str | None = None


@dataclass(frozen=True, slots=True)
class AliasesConfig:
    benchmarks: dict[str, str] = field(default_factory=dict)
    parameters: dict[str, str] = field(default_factory=dict)


@dataclass(frozen=True, slots=True)
class ReportPreset:
    benchmark: str | None = None
    metric: str | None = None
    view: str | None = None
    latest: int | None = None
    latest_per_benchmark: bool = False


@dataclass(frozen=True, slots=True)
class Config:
    project_root: Path
    pyproject: Path | None
    benchmark_paths: tuple[Path, ...]
    results_dir: str
    storage_options: dict[str, Any]
    project_version: str | None
    suite: IdentityConfig
    subject: IdentityConfig
    env: dict[str, str] = field(default_factory=dict)
    aliases: AliasesConfig = field(default_factory=AliasesConfig)
    reports: dict[str, ReportPreset] = field(default_factory=dict)


def _find_pyproject(start: Path) -> Path | None:
    current = start.resolve()
    for directory in (current, *current.parents):
        candidate = directory / "pyproject.toml"
        if candidate.is_file():
            return candidate
    return None


def _table(value: Any, field_name: str) -> dict[str, Any]:
    if value is None:
        return {}
    if not isinstance(value, Mapping):
        raise ConfigError(f"{field_name} must be a TOML table")
    return dict(value)


def _deep_merge(base: dict[str, Any], override: Mapping[str, Any]) -> dict[str, Any]:
    merged = dict(base)
    for key, value in override.items():
        if isinstance(value, Mapping) and isinstance(merged.get(key), Mapping):
            merged[key] = _deep_merge(dict(merged[key]), value)
        elif value is not None:
            merged[key] = value
    return merged


def _optional_string(value: Any, field_name: str) -> str | None:
    if value is None:
        return None
    if not isinstance(value, str) or not value:
        raise ConfigError(f"{field_name} must be a non-empty string")
    return value


def _identity(value: Any, field_name: str) -> IdentityConfig:
    data = _table(value, field_name)
    name = _optional_string(data.get("name"), f"{field_name}.name")
    if name is None:
        raise ConfigError(f"{field_name}.name is required")
    return IdentityConfig(
        name=name,
        repository=_optional_string(data.get("repository"), f"{field_name}.repository"),
        distribution=_optional_string(data.get("distribution"), f"{field_name}.distribution"),
    )


def _alias_table(value: Any, field_name: str) -> dict[str, str]:
    table = _table(value, field_name)
    if not all(isinstance(key, str) and key and isinstance(item, str) and item for key, item in table.items()):
        raise ConfigError(f"{field_name} keys and values must be non-empty strings")
    return table


def _aliases(value: Any) -> AliasesConfig:
    data = _table(value, "tool.benched.aliases")
    unknown = sorted(set(data) - {"benchmarks", "parameters"})
    if unknown:
        raise ConfigError(f"unknown tool.benched.aliases keys: {', '.join(unknown)}")
    return AliasesConfig(
        benchmarks=_alias_table(data.get("benchmarks"), "tool.benched.aliases.benchmarks"),
        parameters=_alias_table(data.get("parameters"), "tool.benched.aliases.parameters"),
    )


def _report_preset(name: str, value: Any) -> ReportPreset:
    field_name = f"tool.benched.reports.{name}"
    data = _table(value, field_name)
    unknown = sorted(set(data) - {"benchmark", "metric", "view", "latest", "latest_per_benchmark"})
    if unknown:
        raise ConfigError(f"unknown {field_name} keys: {', '.join(unknown)}")
    metric = _optional_string(data.get("metric"), f"{field_name}.metric")
    if metric is not None and metric not in _PRESET_METRICS:
        raise ConfigError(f"{field_name}.metric must be one of {', '.join(_PRESET_METRICS)}")
    view = _optional_string(data.get("view"), f"{field_name}.view")
    if view is not None and view not in _PRESET_VIEWS:
        raise ConfigError(f"{field_name}.view must be one of {', '.join(_PRESET_VIEWS)}")
    latest = data.get("latest")
    if latest is not None and (type(latest) is not int or latest < 1):
        raise ConfigError(f"{field_name}.latest must be a positive integer")
    latest_per_benchmark = data.get("latest_per_benchmark", False)
    if not isinstance(latest_per_benchmark, bool):
        raise ConfigError(f"{field_name}.latest_per_benchmark must be a boolean")
    if latest is not None and latest_per_benchmark:
        raise ConfigError(f"{field_name} cannot combine latest with latest_per_benchmark")
    return ReportPreset(
        benchmark=_optional_string(data.get("benchmark"), f"{field_name}.benchmark"),
        metric=metric,
        view=view,
        latest=latest,
        latest_per_benchmark=latest_per_benchmark,
    )


def _subprocess_environment(value: Any) -> dict[str, str]:
    environment = _table(value, "tool.benched.env")
    if not all(isinstance(key, str) and key and isinstance(item, str) for key, item in environment.items()):
        raise ConfigError("tool.benched.env values must be strings")
    return environment


def _environment_config(environ: Mapping[str, str]) -> dict[str, Any]:
    config: dict[str, Any] = {}
    scalar_fields = {
        "BENCHED_RESULTS_DIR": ("results_dir",),
        "BENCHED_SUITE_NAME": ("suite", "name"),
        "BENCHED_SUITE_REPOSITORY": ("suite", "repository"),
        "BENCHED_SUBJECT_NAME": ("subject", "name"),
        "BENCHED_SUBJECT_REPOSITORY": ("subject", "repository"),
        "BENCHED_SUBJECT_DISTRIBUTION": ("subject", "distribution"),
    }
    for variable, path in scalar_fields.items():
        value = environ.get(variable)
        if not value:
            continue
        target = config
        for part in path[:-1]:
            target = target.setdefault(part, {})
        target[path[-1]] = value
    return config


def _results_url(project_root: Path, value: str) -> str:
    if "://" in value or "::" in value:
        return value
    return str((project_root / value).resolve())


def load_config(
    pyproject: str | Path | None = None,
    *,
    start: str | Path | None = None,
    environ: Mapping[str, str] | None = None,
    overrides: Mapping[str, Any] | None = None,
) -> Config:
    start_path = Path(start) if start is not None else Path.cwd()
    pyproject_path = Path(pyproject).resolve() if pyproject is not None else _find_pyproject(start_path)

    document: dict[str, Any] = {}
    if pyproject_path is not None:
        if not pyproject_path.is_file():
            raise ConfigError(f"pyproject.toml not found: {pyproject_path}")
        with pyproject_path.open("rb") as file:
            document = tomllib.load(file)

    project_root = pyproject_path.parent if pyproject_path is not None else start_path.resolve()
    project = _table(document.get("project"), "project")
    project_name = _optional_string(project.get("name"), "project.name") or project_root.name
    project_version = _optional_string(project.get("version"), "project.version")
    urls = _table(project.get("urls"), "project.urls")
    repository = _optional_string(urls.get("Repository") or urls.get("repository"), "project.urls.Repository")

    config: dict[str, Any] = {
        "benchmark_paths": ["benchmarks"],
        "results_dir": ".benched/results",
        "suite": {"name": project_name, "repository": repository},
        "subject": {"name": project_name, "repository": repository, "distribution": project_name},
    }
    tool = _table(document.get("tool"), "tool")
    config = _deep_merge(config, _table(tool.get("benched"), "tool.benched"))
    config = _deep_merge(config, _environment_config(environ if environ is not None else os.environ))
    if overrides:
        config = _deep_merge(config, overrides)

    raw_paths = config.get("benchmark_paths")
    if not isinstance(raw_paths, list) or not raw_paths or not all(isinstance(item, str) and item for item in raw_paths):
        raise ConfigError("tool.benched.benchmark_paths must be a non-empty array of strings")
    results_dir = _optional_string(config.get("results_dir"), "tool.benched.results_dir")
    if results_dir is None:
        raise ConfigError("tool.benched.results_dir is required")

    return Config(
        project_root=project_root,
        pyproject=pyproject_path,
        benchmark_paths=tuple(project_root / path for path in raw_paths),
        results_dir=_results_url(project_root, results_dir),
        storage_options=_table(config.get("storage_options"), "tool.benched.storage_options"),
        project_version=project_version,
        suite=_identity(config.get("suite"), "tool.benched.suite"),
        subject=_identity(config.get("subject"), "tool.benched.subject"),
        env=_subprocess_environment(config.get("env")),
        aliases=_aliases(config.get("aliases")),
        reports={name: _report_preset(name, table) for name, table in _table(config.get("reports"), "tool.benched.reports").items()},
    )
