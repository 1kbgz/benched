from __future__ import annotations

import ast
import hashlib
import itertools
import json
import math
import re
import statistics
from dataclasses import asdict, dataclass
from datetime import UTC, datetime, timedelta
from pathlib import Path
from typing import Any
from urllib.parse import quote

from . import __version__
from .model import EnvironmentInfo, Identity, MachineInfo, Measurement, Provenance, Run, ToolInfo
from .storage import read_runs, save_run


class AsvImportError(ValueError):
    """Raised when ASV history cannot be converted safely."""


@dataclass(frozen=True, slots=True)
class AsvIdentityOptions:
    suite_name: str
    suite_repository: str | None = None
    subject_name: str | None = None
    subject_repository: str | None = None
    subject_version: str | None = None
    subject_version_param: str | None = None


@dataclass(frozen=True, slots=True)
class AsvImportSummary:
    converted: int
    imported: int
    skipped: int
    ignored: int
    runs: tuple[Run, ...]
    locations: tuple[str, ...]
    warnings: tuple[str, ...]


def _mapping(value: Any, field_name: str) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise AsvImportError(f"{field_name} must be an object")
    return value


def _load_json(path: Path) -> dict[str, Any]:
    try:
        with path.open(encoding="utf-8") as file:
            return _mapping(json.load(file), str(path))
    except (OSError, json.JSONDecodeError) as error:
        raise AsvImportError(f"cannot read ASV JSON {path}: {error}") from error


def _strip_json_comments(value: str) -> str:
    output: list[str] = []
    in_string = False
    escaped = False
    index = 0
    while index < len(value):
        character = value[index]
        if in_string:
            output.append(character)
            if escaped:
                escaped = False
            elif character == "\\":
                escaped = True
            elif character == '"':
                in_string = False
            index += 1
            continue
        if character == '"':
            in_string = True
            output.append(character)
            index += 1
            continue
        if character == "/" and index + 1 < len(value) and value[index + 1] == "/":
            index += 2
            while index < len(value) and value[index] not in "\r\n":
                index += 1
            continue
        output.append(character)
        index += 1
    return "".join(output)


def _strip_trailing_commas(value: str) -> str:
    output: list[str] = []
    in_string = False
    escaped = False
    index = 0
    while index < len(value):
        character = value[index]
        if in_string:
            output.append(character)
            if escaped:
                escaped = False
            elif character == "\\":
                escaped = True
            elif character == '"':
                in_string = False
            index += 1
            continue
        if character == '"':
            in_string = True
        if character == ",":
            next_index = index + 1
            while next_index < len(value) and value[next_index].isspace():
                next_index += 1
            if next_index < len(value) and value[next_index] in "}]":
                index += 1
                continue
        output.append(character)
        index += 1
    return "".join(output)


def load_asv_config(path: str | Path) -> dict[str, Any]:
    config_path = Path(path)
    try:
        value = _strip_trailing_commas(_strip_json_comments(config_path.read_text(encoding="utf-8")))
        return _mapping(json.loads(value), str(config_path))
    except (OSError, json.JSONDecodeError) as error:
        raise AsvImportError(f"cannot read ASV configuration {config_path}: {error}") from error


def infer_asv_identities(
    results: str | Path,
    *,
    asv_config: str | Path | None = None,
    suite_name: str | None = None,
    suite_repository: str | None = None,
    subject_name: str | None = None,
    subject_repository: str | None = None,
    subject_version: str | None = None,
    subject_version_param: str | None = None,
) -> AsvIdentityOptions:
    results_path = Path(results).resolve()
    config_path = Path(asv_config).resolve() if asv_config else results_path.parent / "asv.conf.json"
    config = load_asv_config(config_path) if config_path.is_file() else {}
    inferred_name = config.get("project")
    if inferred_name is not None and not isinstance(inferred_name, str):
        raise AsvImportError("ASV configuration project must be a string")
    name = suite_name or inferred_name or results_path.parent.name
    repository = suite_repository or config.get("repo") or config.get("project_url")
    if repository is not None and not isinstance(repository, str):
        raise AsvImportError("ASV configuration repo/project_url must be a string")
    return AsvIdentityOptions(
        suite_name=name,
        suite_repository=repository,
        subject_name=subject_name or name,
        subject_repository=subject_repository or (repository if subject_name is None or subject_name == name else None),
        subject_version=subject_version,
        subject_version_param=subject_version_param,
    )


def _fingerprint(value: Any) -> str:
    payload = json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=True).encode()
    return hashlib.sha256(payload).hexdigest()


def _memory_gib(value: Any) -> float | None:
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        gib = float(value) / 1024**3
    elif isinstance(value, str):
        match = re.fullmatch(r"\s*(\d+(?:\.\d+)?)\s*([KMGT]?)(?:I?B)?\s*", value, re.IGNORECASE)
        if match is None:
            return None
        amount = float(match.group(1))
        scale = {"": 1 / 1024**3, "K": 1 / 1024**2, "M": 1 / 1024, "G": 1, "T": 1024}[match.group(2).upper()]
        gib = amount * scale
    else:
        return None
    return math.floor(gib * 2 + 0.5) / 2


def _timestamp(value: Any, field_name: str) -> datetime:
    if not isinstance(value, (int, float)) or isinstance(value, bool):
        raise AsvImportError(f"{field_name} must be a Unix timestamp in milliseconds")
    return datetime.fromtimestamp(float(value) / 1000, tz=UTC)


def _parameter(value: Any) -> Any:
    if not isinstance(value, str):
        return value
    try:
        return ast.literal_eval(value)
    except (SyntaxError, ValueError):
        return value


def _benchmark_id(name: str, parameters: dict[str, Any]) -> str:
    if not parameters:
        return name
    encoded = "&".join(
        f"{quote(key, safe='')}={quote(json.dumps(value, sort_keys=True, separators=(',', ':'), ensure_ascii=True), safe='')}"
        for key, value in sorted(parameters.items())
    )
    return f"{name}|{encoded}"


def _row(document: dict[str, Any], name: str, raw: Any, version: int) -> dict[str, Any]:
    if version == 1:
        return {"result": raw}
    columns = document.get("result_columns")
    if not isinstance(columns, list) or not all(isinstance(column, str) for column in columns):
        raise AsvImportError("ASV v2 result_columns must be an array of strings")
    if not isinstance(raw, list):
        raise AsvImportError(f"ASV v2 result {name!r} must be an array")
    return {str(column): value for column, value in zip(columns, raw)}


def _values(value: Any, count: int, name: str) -> list[Any]:
    if value is None:
        return [None] * count
    values = value if isinstance(value, list) else [value]
    if len(values) != count:
        raise AsvImportError(f"ASV result {name!r} has {len(values)} values for {count} parameter combinations")
    return values


def _item(value: Any, index: int, count: int) -> Any:
    if count == 1:
        if isinstance(value, list) and len(value) == 1:
            return value[0]
        return value
    return value[index] if isinstance(value, list) and index < len(value) else None


def _samples(value: Any, index: int, count: int) -> tuple[float, ...] | None:
    selected = _item(value, index, count)
    if not isinstance(selected, list) or not all(isinstance(item, (int, float)) and not isinstance(item, bool) for item in selected):
        return None
    return tuple(float(item) for item in selected)


def _stats(value: Any, unit: str, samples: tuple[float, ...] | None, row: dict[str, Any], index: int, count: int) -> dict[str, Any]:
    numeric = float(value) if isinstance(value, (int, float)) and not isinstance(value, bool) else None
    stats: dict[str, Any] = {
        "median": numeric if numeric is not None else value,
        "mean": statistics.fmean(samples) if samples else numeric,
        "min": min(samples) if samples else numeric,
        "max": max(samples) if samples else numeric,
        "ops": 1 / numeric if numeric is not None and numeric > 0 and unit == "seconds" else None,
    }
    for source, target in {
        "stats_q_25": "q25",
        "stats_q_75": "q75",
        "stats_ci_99_a": "ci99_low",
        "stats_ci_99_b": "ci99_high",
        "stats_number": "number",
        "stats_repeat": "repeat",
    }.items():
        selected = _item(row.get(source), index, count)
        if isinstance(selected, (int, float, str)) and not isinstance(selected, bool):
            stats[target] = selected
    return stats


def _measurements(document: dict[str, Any], benchmarks: dict[str, Any], version: int) -> tuple[tuple[Measurement, ...], tuple[str, ...]]:
    raw_results = _mapping(document.get("results"), "ASV results")
    measurements: list[Measurement] = []
    warnings: list[str] = []
    for name in sorted(raw_results):
        metadata = _mapping(benchmarks.get(name), f"ASV benchmark metadata for {name!r}")
        names = metadata.get("param_names", [])
        row = _row(document, name, raw_results[name], version)
        axes = row.get("params") or metadata.get("params", [])
        if not isinstance(names, list) or not all(isinstance(item, str) for item in names):
            raise AsvImportError(f"ASV benchmark {name!r} param_names must be an array of strings")
        parameter_names = [str(item) for item in names]
        if not isinstance(axes, list) or len(axes) != len(names) or not all(isinstance(axis, list) for axis in axes):
            raise AsvImportError(f"ASV benchmark {name!r} parameter axes do not match param_names")
        combinations = list(itertools.product(*axes)) if axes else [()]
        result = row.get("result")
        if len(combinations) > 1 and result is not None and not isinstance(result, list):
            warnings.append(f"ASV result {name!r} predates its parameter grid; preserved one unparameterized value")
            combinations = [()]
            parameter_names = []
        values = _values(result, len(combinations), name)
        unit = metadata.get("unit", "seconds")
        if not isinstance(unit, str) or not unit:
            raise AsvImportError(f"ASV benchmark {name!r} unit must be a non-empty string")
        for index, combination in enumerate(combinations):
            parameters = {key: _parameter(value) for key, value in zip(parameter_names, combination)}
            samples = _samples(row.get("samples"), index, len(combinations))
            parameter_id = ",".join(f"{key}={value}" for key, value in parameters.items()) or None
            options = {key: value for key, value in metadata.items() if key not in {"code", "name", "param_names", "params", "unit", "version"}}
            measurements.append(
                Measurement(
                    benchmark_id=_benchmark_id(name, parameters),
                    nodeid=name,
                    name=name,
                    group=name.rpartition(".")[0] or None,
                    parameter_id=parameter_id,
                    parameters=parameters,
                    unit=unit,
                    options=options,
                    extra_info={
                        "asv_benchmark_version": row.get("version") or metadata.get("version"),
                        "asv_duration": _item(row.get("duration"), index, len(combinations)),
                    },
                    stats=_stats(values[index], unit, samples, row, index, len(combinations)),
                    samples=samples,
                )
            )
    return tuple(measurements), tuple(warnings)


def _python_version(document: dict[str, Any], source: Path) -> str:
    raw = str(document.get("python") or _mapping(document.get("params", {}), "ASV params").get("python") or "")
    environment_name = str(document.get("env_name") or source.stem)
    match = re.search(r"(?:^|[-_])py(?:thon)?(\d+(?:\.\d+)+)", environment_name, re.IGNORECASE)
    if match:
        return match.group(1)
    if re.fullmatch(r"\d+(?:\.\d+)+", raw):
        return raw
    return raw or "unknown"


def _duration(value: Any) -> float:
    if isinstance(value, list):
        numbers = [float(item) for item in value if isinstance(item, (int, float)) and not isinstance(item, bool)]
        return max(numbers, default=0)
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        return max(float(value), 0)
    return 0


def convert_asv_result(
    source: str | Path,
    benchmarks: dict[str, Any],
    identities: AsvIdentityOptions,
    *,
    machine_metadata: dict[str, Any] | None = None,
) -> Run:
    source_path = Path(source).resolve()
    document = _load_json(source_path)
    version = document.get("version", 1)
    if type(version) is not int or version not in {1, 2}:
        raise AsvImportError(f"ASV result {source_path} uses unsupported version {version!r}; expected 1 or 2")
    commit = document.get("commit_hash")
    if not isinstance(commit, str) or not commit:
        raise AsvImportError(f"ASV result {source_path} has no commit_hash")
    parameters = _mapping(document.get("params", {}), "ASV params")
    machine = parameters.get("machine") or source_path.parent.name
    if not isinstance(machine, str) or not machine:
        raise AsvImportError(f"ASV result {source_path} has no machine name")
    machine_keys = {"arch", "cpu", "num_cpu", "os", "ram"}
    metadata = {**(machine_metadata or {}), **{key: value for key, value in parameters.items() if key in machine_keys}}
    metadata.pop("version", None)
    metadata.pop("machine", None)
    if (memory_gib := _memory_gib(metadata.get("ram"))) is not None:
        metadata["memory_gib"] = memory_gib
    raw_results = _mapping(document.get("results"), "ASV results")
    rows = [_row(document, name, value, version) for name, value in raw_results.items()]
    starts = [
        _timestamp(row["started_at"], f"ASV result {name!r} started_at") for (name, _), row in zip(raw_results.items(), rows) if row.get("started_at")
    ]
    started = min(starts) if starts else _timestamp(document.get("date"), "ASV result date")
    ends = []
    for row in rows:
        if row.get("started_at"):
            row_started = _timestamp(row["started_at"], "ASV benchmark started_at")
            ends.append(row_started + timedelta(seconds=_duration(row.get("duration"))))
    ended = max(ends) if ends else started
    measurements, measurement_warnings = _measurements(document, benchmarks, version)
    warnings = list(measurement_warnings)
    if not starts:
        warnings.append("ASV result has no benchmark timestamps; used the result date")
    unavailable = sum(measurement.stats.get("median") is None for measurement in measurements)
    if unavailable:
        warnings.append(f"{unavailable} ASV measurements have no result")

    subject_name = identities.subject_name or identities.suite_name
    version_parameter = identities.subject_version_param
    requirements = _mapping(document.get("requirements", {}), "ASV requirements")
    subject_version = identities.subject_version
    if subject_version is None and version_parameter:
        value = parameters.get(version_parameter, requirements.get(version_parameter))
        subject_version = str(value) if value is not None else None
        if subject_version is None:
            warnings.append(f"ASV subject version parameter {version_parameter!r} is missing")
    subject_revision = commit if subject_name == identities.suite_name and version_parameter is None and subject_version is None else None
    labels = {f"requirement:{key}": str(value) for key, value in sorted(requirements.items())}
    labels.update({f"asv-param:{key}": str(value) for key, value in sorted(parameters.items()) if key not in machine_keys | {"machine", "python"}})
    raw_python = str(document.get("python") or parameters.get("python") or "unknown")
    environment_value = {"python": raw_python, "requirements": requirements, "env_vars": document.get("env_vars", {})}
    source_checksum = hashlib.sha256(source_path.read_bytes()).hexdigest()
    digest_value = {
        "source": source_checksum,
        "benchmarks": benchmarks,
        "machine": machine_metadata or {},
        "identities": asdict(identities),
    }
    run = Run(
        run_id=f"asv-{_fingerprint(digest_value)[:24]}",
        started_at=started.isoformat(),
        ended_at=ended.isoformat(),
        status="success" if measurements and unavailable < len(measurements) else "failed",
        exit_code=0 if measurements and unavailable < len(measurements) else 1,
        suite=Identity(name=identities.suite_name, repository=identities.suite_repository, revision=commit),
        subject=Identity(name=subject_name, repository=identities.subject_repository, version=subject_version, revision=subject_revision),
        machine=MachineInfo(id=machine, fingerprint=_fingerprint(metadata), metadata=metadata),
        environment=EnvironmentInfo(
            fingerprint=_fingerprint(environment_value),
            python_implementation="PyPy" if "pypy" in raw_python.lower() else "CPython",
            python_version=_python_version(document, source_path),
            platform=str(metadata.get("os") or "unknown"),
            architecture=str(metadata.get("arch") or "unknown"),
            labels=labels,
        ),
        tool=ToolInfo(benched=__version__, pytest="not-applicable", pytest_benchmark="not-applicable"),
        measurements=measurements,
        provenance=Provenance(
            source_format="asv",
            source_file=str(source_path),
            source_checksum=f"sha256:{source_checksum}",
            warnings=tuple(warnings),
        ),
    )
    return Run.from_dict(run.to_dict())


def import_asv_results(
    source: str | Path,
    destination: str,
    identities: AsvIdentityOptions,
    *,
    storage_options: dict[str, Any] | None = None,
    dry_run: bool = False,
) -> AsvImportSummary:
    source_path = Path(source).resolve()
    if not source_path.is_dir():
        raise AsvImportError(f"ASV results directory not found: {source_path}")
    benchmarks_path = source_path / "benchmarks.json"
    if not benchmarks_path.is_file():
        raise AsvImportError(f"ASV benchmarks metadata not found: {benchmarks_path}")
    benchmarks = _load_json(benchmarks_path)
    benchmarks.pop("version", None)
    files = sorted(path for path in source_path.rglob("*.json") if path.name not in {"benchmarks.json", "machine.json"})
    if not files:
        raise AsvImportError(f"no ASV result documents found beneath {source_path}")
    existing = {stored.run.run_id for stored in read_runs(destination, storage_options=storage_options)}
    converted: list[Run] = []
    locations: list[str] = []
    warnings: list[str] = []
    skipped = 0
    ignored = 0
    for path in files:
        try:
            candidate = _load_json(path)
        except AsvImportError as error:
            ignored += 1
            warnings.append(str(error))
            continue
        if not isinstance(candidate.get("commit_hash"), str) or not isinstance(candidate.get("results"), dict):
            ignored += 1
            warnings.append(f"ignored non-result ASV JSON {path}")
            continue
        machine_path = path.parent / "machine.json"
        machine_metadata = _load_json(machine_path) if machine_path.is_file() else {}
        run = convert_asv_result(path, benchmarks, identities, machine_metadata=machine_metadata)
        converted.append(run)
        if run.run_id in existing:
            skipped += 1
            continue
        if not dry_run:
            locations.append(save_run(destination, run, storage_options=storage_options))
        existing.add(run.run_id)
    if not converted:
        raise AsvImportError(f"no usable ASV result documents found beneath {source_path}")
    return AsvImportSummary(
        converted=len(converted),
        imported=0 if dry_run else len(locations),
        skipped=skipped,
        ignored=ignored,
        runs=tuple(converted),
        locations=tuple(locations),
        warnings=tuple(warnings),
    )
