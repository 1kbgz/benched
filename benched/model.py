from __future__ import annotations

import json
from collections.abc import Mapping
from dataclasses import asdict, dataclass, field
from importlib.resources import files
from pathlib import Path
from typing import Any, Literal

RUN_SCHEMA_VERSION = 1
REPORT_SCHEMA_VERSION = 1

RunStatus = Literal["success", "failed", "interrupted"]


class SchemaError(ValueError):
    """Raised when serialized Benched data does not satisfy its core contract."""


class SchemaVersionError(SchemaError):
    """Raised when serialized Benched data uses an unsupported schema version."""


def _mapping(value: Any, field_name: str) -> Mapping[str, Any]:
    if not isinstance(value, Mapping):
        raise SchemaError(f"{field_name} must be an object")
    return value


def _string(value: Any, field_name: str) -> str:
    if not isinstance(value, str) or not value:
        raise SchemaError(f"{field_name} must be a non-empty string")
    return value


def _optional_string(value: Any, field_name: str) -> str | None:
    if value is not None and not isinstance(value, str):
        raise SchemaError(f"{field_name} must be a string or null")
    return value


def _schema_version(data: Mapping[str, Any], *, kind: str, current: int) -> int:
    version = data.get("schema_version")
    if type(version) is not int:
        raise SchemaVersionError(f"{kind} schema_version must be an integer")
    if version > current:
        raise SchemaVersionError(f"{kind} schema version {version} is newer than supported version {current}")
    if version < current:
        raise SchemaVersionError(f"{kind} schema version {version} is no longer supported; expected version {current}")
    return version


def _labels(value: Any, field_name: str) -> dict[str, str]:
    labels = _mapping(value, field_name)
    if not all(isinstance(key, str) and isinstance(item, str) for key, item in labels.items()):
        raise SchemaError(f"{field_name} keys and values must be strings")
    return dict(labels)


@dataclass(frozen=True, slots=True)
class Identity:
    name: str
    repository: str | None = None
    version: str | None = None
    revision: str | None = None
    branch: str | None = None
    dirty: bool | None = None
    labels: dict[str, str] = field(default_factory=dict)

    @classmethod
    def from_dict(cls, value: Any, field_name: str) -> Identity:
        data = _mapping(value, field_name)
        dirty = data.get("dirty")
        if dirty is not None and not isinstance(dirty, bool):
            raise SchemaError(f"{field_name}.dirty must be a boolean or null")
        return cls(
            name=_string(data.get("name"), f"{field_name}.name"),
            repository=_optional_string(data.get("repository"), f"{field_name}.repository"),
            version=_optional_string(data.get("version"), f"{field_name}.version"),
            revision=_optional_string(data.get("revision"), f"{field_name}.revision"),
            branch=_optional_string(data.get("branch"), f"{field_name}.branch"),
            dirty=dirty,
            labels=_labels(data.get("labels", {}), f"{field_name}.labels"),
        )


@dataclass(frozen=True, slots=True)
class MachineInfo:
    id: str
    fingerprint: str
    metadata: dict[str, Any] = field(default_factory=dict)
    labels: dict[str, str] = field(default_factory=dict)

    @classmethod
    def from_dict(cls, value: Any) -> MachineInfo:
        data = _mapping(value, "machine")
        return cls(
            id=_string(data.get("id"), "machine.id"),
            fingerprint=_string(data.get("fingerprint"), "machine.fingerprint"),
            metadata=dict(_mapping(data.get("metadata", {}), "machine.metadata")),
            labels=_labels(data.get("labels", {}), "machine.labels"),
        )


@dataclass(frozen=True, slots=True)
class EnvironmentInfo:
    fingerprint: str
    python_implementation: str
    python_version: str
    platform: str
    architecture: str
    labels: dict[str, str] = field(default_factory=dict)

    @classmethod
    def from_dict(cls, value: Any) -> EnvironmentInfo:
        data = _mapping(value, "environment")
        return cls(
            fingerprint=_string(data.get("fingerprint"), "environment.fingerprint"),
            python_implementation=_string(data.get("python_implementation"), "environment.python_implementation"),
            python_version=_string(data.get("python_version"), "environment.python_version"),
            platform=_string(data.get("platform"), "environment.platform"),
            architecture=_string(data.get("architecture"), "environment.architecture"),
            labels=_labels(data.get("labels", {}), "environment.labels"),
        )


@dataclass(frozen=True, slots=True)
class ToolInfo:
    benched: str
    pytest: str
    pytest_benchmark: str

    @classmethod
    def from_dict(cls, value: Any) -> ToolInfo:
        data = _mapping(value, "tool")
        return cls(
            benched=_string(data.get("benched"), "tool.benched"),
            pytest=_string(data.get("pytest"), "tool.pytest"),
            pytest_benchmark=_string(data.get("pytest_benchmark"), "tool.pytest_benchmark"),
        )


@dataclass(frozen=True, slots=True)
class Measurement:
    benchmark_id: str
    nodeid: str
    name: str
    group: str | None = None
    parameter_id: str | None = None
    parameters: dict[str, Any] = field(default_factory=dict)
    unit: str = "seconds"
    options: dict[str, Any] = field(default_factory=dict)
    extra_info: dict[str, Any] = field(default_factory=dict)
    stats: dict[str, int | float | str | None] = field(default_factory=dict)
    samples: tuple[float, ...] | None = None

    @classmethod
    def from_dict(cls, value: Any) -> Measurement:
        data = _mapping(value, "measurement")
        raw_samples = data.get("samples")
        if raw_samples is not None:
            if not isinstance(raw_samples, list) or not all(isinstance(item, (int, float)) and not isinstance(item, bool) for item in raw_samples):
                raise SchemaError("measurement.samples must be an array of numbers or null")
            samples = tuple(float(item) for item in raw_samples)
        else:
            samples = None
        return cls(
            benchmark_id=_string(data.get("benchmark_id"), "measurement.benchmark_id"),
            nodeid=_string(data.get("nodeid"), "measurement.nodeid"),
            name=_string(data.get("name"), "measurement.name"),
            group=_optional_string(data.get("group"), "measurement.group"),
            parameter_id=_optional_string(data.get("parameter_id"), "measurement.parameter_id"),
            parameters=dict(_mapping(data.get("parameters", {}), "measurement.parameters")),
            unit=_string(data.get("unit"), "measurement.unit"),
            options=dict(_mapping(data.get("options", {}), "measurement.options")),
            extra_info=dict(_mapping(data.get("extra_info", {}), "measurement.extra_info")),
            stats=dict(_mapping(data.get("stats", {}), "measurement.stats")),
            samples=samples,
        )

    def to_dict(self) -> dict[str, Any]:
        result = asdict(self)
        result["samples"] = list(self.samples) if self.samples is not None else None
        return result


@dataclass(frozen=True, slots=True)
class Provenance:
    source_format: str
    source_file: str | None = None
    source_checksum: str | None = None
    warnings: tuple[str, ...] = ()

    @classmethod
    def from_dict(cls, value: Any) -> Provenance:
        data = _mapping(value, "provenance")
        warnings = data.get("warnings", [])
        if not isinstance(warnings, list) or not all(isinstance(item, str) for item in warnings):
            raise SchemaError("provenance.warnings must be an array of strings")
        return cls(
            source_format=_string(data.get("source_format"), "provenance.source_format"),
            source_file=_optional_string(data.get("source_file"), "provenance.source_file"),
            source_checksum=_optional_string(data.get("source_checksum"), "provenance.source_checksum"),
            warnings=tuple(warnings),
        )


@dataclass(frozen=True, slots=True)
class Run:
    run_id: str
    started_at: str
    ended_at: str
    status: RunStatus
    exit_code: int
    suite: Identity
    subject: Identity
    machine: MachineInfo
    environment: EnvironmentInfo
    tool: ToolInfo
    measurements: tuple[Measurement, ...] = ()
    provenance: Provenance = field(default_factory=lambda: Provenance(source_format="benched"))
    schema_version: int = RUN_SCHEMA_VERSION

    @classmethod
    def from_dict(cls, value: Any) -> Run:
        data = _mapping(value, "run")
        version = _schema_version(data, kind="run", current=RUN_SCHEMA_VERSION)
        status = data.get("status")
        if status not in {"success", "failed", "interrupted"}:
            raise SchemaError("run.status must be success, failed, or interrupted")
        exit_code = data.get("exit_code")
        if type(exit_code) is not int:
            raise SchemaError("run.exit_code must be an integer")
        raw_measurements = data.get("measurements")
        if not isinstance(raw_measurements, list):
            raise SchemaError("run.measurements must be an array")
        return cls(
            schema_version=version,
            run_id=_string(data.get("run_id"), "run.run_id"),
            started_at=_string(data.get("started_at"), "run.started_at"),
            ended_at=_string(data.get("ended_at"), "run.ended_at"),
            status=status,
            exit_code=exit_code,
            suite=Identity.from_dict(data.get("suite"), "suite"),
            subject=Identity.from_dict(data.get("subject"), "subject"),
            machine=MachineInfo.from_dict(data.get("machine")),
            environment=EnvironmentInfo.from_dict(data.get("environment")),
            tool=ToolInfo.from_dict(data.get("tool")),
            measurements=tuple(Measurement.from_dict(item) for item in raw_measurements),
            provenance=Provenance.from_dict(data.get("provenance")),
        )

    def to_dict(self) -> dict[str, Any]:
        result = asdict(self)
        result["measurements"] = [measurement.to_dict() for measurement in self.measurements]
        result["provenance"]["warnings"] = list(self.provenance.warnings)
        return {"schema_version": result.pop("schema_version"), **result}


@dataclass(frozen=True, slots=True)
class Report:
    generated_at: str
    source_run_ids: tuple[str, ...]
    runs: tuple[dict[str, Any], ...] = ()
    benchmarks: tuple[dict[str, Any], ...] = ()
    warnings: tuple[str, ...] = ()
    schema_version: int = REPORT_SCHEMA_VERSION

    @classmethod
    def from_dict(cls, value: Any) -> Report:
        data = _mapping(value, "report")
        version = _schema_version(data, kind="report", current=REPORT_SCHEMA_VERSION)
        source_run_ids = data.get("source_run_ids")
        runs = data.get("runs")
        benchmarks = data.get("benchmarks")
        warnings = data.get("warnings")
        if not isinstance(source_run_ids, list) or not all(isinstance(item, str) and item for item in source_run_ids):
            raise SchemaError("report.source_run_ids must be an array of non-empty strings")
        if not isinstance(runs, list) or not all(isinstance(item, Mapping) for item in runs):
            raise SchemaError("report.runs must be an array of objects")
        if not isinstance(benchmarks, list) or not all(isinstance(item, Mapping) for item in benchmarks):
            raise SchemaError("report.benchmarks must be an array of objects")
        if not isinstance(warnings, list) or not all(isinstance(item, str) for item in warnings):
            raise SchemaError("report.warnings must be an array of strings")
        return cls(
            schema_version=version,
            generated_at=_string(data.get("generated_at"), "report.generated_at"),
            source_run_ids=tuple(source_run_ids),
            runs=tuple(dict(item) for item in runs),
            benchmarks=tuple(dict(item) for item in benchmarks),
            warnings=tuple(warnings),
        )

    def to_dict(self) -> dict[str, Any]:
        return {
            "schema_version": self.schema_version,
            "generated_at": self.generated_at,
            "source_run_ids": list(self.source_run_ids),
            "runs": list(self.runs),
            "benchmarks": list(self.benchmarks),
            "warnings": list(self.warnings),
        }


def schema_path(kind: Literal["run", "report"], version: int = 1) -> Path:
    current = RUN_SCHEMA_VERSION if kind == "run" else REPORT_SCHEMA_VERSION
    if version != current:
        raise SchemaVersionError(f"{kind} schema version {version} is not available; current version is {current}")
    return Path(str(files("benched.schema").joinpath(f"{kind}-v{version}.json")))


def load_run(path: str | Path) -> Run:
    with Path(path).open(encoding="utf-8") as file:
        return Run.from_dict(json.load(file))


def load_report(path: str | Path) -> Report:
    with Path(path).open(encoding="utf-8") as file:
        return Report.from_dict(json.load(file))
