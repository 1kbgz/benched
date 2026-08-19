from __future__ import annotations

import hashlib
import json
from dataclasses import asdict, dataclass, replace
from datetime import datetime
from pathlib import Path
from typing import Any

from .identity import machine_fingerprint
from .ingest import IngestError, normalize_pytest_benchmark
from .model import EnvironmentInfo, Identity, MachineInfo, Provenance, Run
from .storage import read_runs, save_run


class PytestImportError(ValueError):
    """Raised when pytest-benchmark history cannot be imported safely."""


@dataclass(frozen=True, slots=True)
class PytestImportOptions:
    suite_name: str
    suite_repository: str | None = None
    subject_name: str | None = None
    subject_repository: str | None = None
    subject_version: str | None = None
    subject_revision: str | None = None
    machine_id: str | None = None


@dataclass(frozen=True, slots=True)
class PytestImportSummary:
    converted: int
    imported: int
    skipped: int
    runs: tuple[Run, ...]
    locations: tuple[str, ...]


def _mapping(value: Any, field_name: str) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise PytestImportError(f"{field_name} must be an object")
    return value


def _timestamp(value: Any, source: Path) -> str:
    if not isinstance(value, str) or not value:
        raise PytestImportError(f"pytest-benchmark document {source} has no datetime")
    try:
        parsed = datetime.fromisoformat(value)
    except ValueError as error:
        raise PytestImportError(f"pytest-benchmark document {source} has invalid datetime {value!r}") from error
    if parsed.tzinfo is None:
        raise PytestImportError(f"pytest-benchmark document {source} datetime must include a timezone")
    return parsed.isoformat()


def _fingerprint(value: Any) -> str:
    payload = json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=True).encode()
    return hashlib.sha256(payload).hexdigest()


def _machine_value(machine_info: dict[str, Any], field_name: str, source: Path) -> str:
    value = machine_info.get(field_name)
    if not isinstance(value, str) or not value:
        raise PytestImportError(f"pytest-benchmark machine_info in {source} has no valid {field_name}")
    return value


def _files(sources: tuple[str | Path, ...]) -> tuple[Path, ...]:
    files: set[Path] = set()
    for source in sources:
        path = Path(source).resolve()
        if path.is_file():
            files.add(path)
        elif path.is_dir():
            files.update(candidate.resolve() for candidate in path.rglob("*.json"))
        else:
            raise PytestImportError(f"pytest-benchmark source not found: {path}")
    if not files:
        raise PytestImportError("no pytest-benchmark JSON documents found")
    return tuple(sorted(files))


def convert_pytest_benchmark(
    source: str | Path,
    identities: PytestImportOptions,
    *,
    save_samples: bool = False,
) -> Run:
    source_path = Path(source).resolve()
    try:
        payload = source_path.read_bytes()
        document = json.loads(payload)
    except OSError as error:
        raise PytestImportError(f"cannot read pytest-benchmark document {source_path}: {error}") from error
    except json.JSONDecodeError as error:
        raise PytestImportError(f"invalid pytest-benchmark JSON {source_path}: {error}") from error
    data = _mapping(document, f"pytest-benchmark document {source_path}")
    machine_info = _mapping(data.get("machine_info"), f"pytest-benchmark machine_info in {source_path}")
    commit_info = _mapping(data.get("commit_info") or {}, f"pytest-benchmark commit_info in {source_path}")
    timestamp = _timestamp(data.get("datetime"), source_path)
    checksum = hashlib.sha256(payload).hexdigest()
    run_id = f"pytest-{_fingerprint({'checksum': checksum, 'identities': asdict(identities)})[:24]}"

    suite_revision = commit_info.get("id")
    suite_revision = suite_revision if isinstance(suite_revision, str) and suite_revision else None
    branch = commit_info.get("branch")
    branch = branch if isinstance(branch, str) and branch else None
    dirty = commit_info.get("dirty")
    dirty = dirty if isinstance(dirty, bool) else None
    subject_name = identities.subject_name or identities.suite_name
    subject_revision = identities.subject_revision or (suite_revision if subject_name == identities.suite_name else None)
    suite = Identity(
        name=identities.suite_name,
        repository=identities.suite_repository,
        revision=suite_revision,
        branch=branch,
        dirty=dirty,
    )
    subject = Identity(
        name=subject_name,
        repository=identities.subject_repository,
        version=identities.subject_version,
        revision=subject_revision,
        branch=branch if subject_name == identities.suite_name else None,
        dirty=dirty if subject_name == identities.suite_name else None,
    )

    machine_id = identities.machine_id or machine_info.get("node") or "unknown"
    if not isinstance(machine_id, str) or not machine_id:
        raise PytestImportError(f"pytest-benchmark machine_info in {source_path} has no valid node")
    machine_metadata = {key: value for key, value in machine_info.items() if key not in {"node", "python_implementation", "python_version"}}
    python_implementation = _machine_value(machine_info, "python_implementation", source_path)
    python_version = _machine_value(machine_info, "python_version", source_path)
    system = _machine_value(machine_info, "system", source_path)
    architecture = _machine_value(machine_info, "machine", source_path)
    machine = MachineInfo(
        id=machine_id,
        fingerprint=machine_fingerprint(
            architecture=machine_metadata.get("machine"),
            cpu=machine_metadata.get("cpu"),
            cpu_count=machine_metadata.get("cpu_count", machine_metadata.get("num_cpu")),
        ),
        metadata=machine_metadata,
    )
    environment_values = {
        "python_implementation": python_implementation,
        "python_version": python_version,
        "platform": system,
        "architecture": architecture,
    }
    environment = EnvironmentInfo(
        fingerprint=_fingerprint(environment_values),
        python_implementation=python_implementation,
        python_version=python_version,
        platform=system,
        architecture=architecture,
    )
    try:
        run = normalize_pytest_benchmark(
            data,
            started_at=timestamp,
            ended_at=timestamp,
            exit_code=0,
            suite=suite,
            subject=subject,
            machine=machine,
            environment=environment,
            save_samples=save_samples,
            run_id=run_id,
        )
    except IngestError as error:
        raise PytestImportError(f"invalid pytest-benchmark document {source_path}: {error}") from error
    return replace(
        run,
        provenance=Provenance(
            source_format="pytest-benchmark",
            source_file=str(source_path),
            source_checksum=f"sha256:{checksum}",
            warnings=("pytest-benchmark JSON has no session end time or exit code; imported as a successful point-in-time run.",),
        ),
    )


def import_pytest_benchmarks(
    sources: tuple[str | Path, ...],
    destination: str,
    identities: PytestImportOptions,
    *,
    storage_options: dict[str, Any] | None = None,
    save_samples: bool = False,
    dry_run: bool = False,
) -> PytestImportSummary:
    existing = {stored.run.run_id for stored in read_runs(destination, storage_options=storage_options)}
    converted: list[Run] = []
    locations: list[str] = []
    skipped = 0
    for path in _files(sources):
        run = convert_pytest_benchmark(path, identities, save_samples=save_samples)
        converted.append(run)
        if run.run_id in existing:
            skipped += 1
            continue
        if not dry_run:
            locations.append(save_run(destination, run, storage_options=storage_options))
        existing.add(run.run_id)
    return PytestImportSummary(
        converted=len(converted),
        imported=0 if dry_run else len(locations),
        skipped=skipped,
        runs=tuple(converted),
        locations=tuple(locations),
    )
