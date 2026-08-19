from __future__ import annotations

import json
import posixpath
import re
from dataclasses import dataclass
from typing import Any
from uuid import uuid4

from fsspec import AbstractFileSystem
from fsspec.core import url_to_fs

from .model import Run

ARCHIVE_NAME = "archive.json.gz"
ARCHIVE_SCHEMA_VERSION = 1


class StorageError(RuntimeError):
    """Raised when immutable benchmark history cannot be read or written."""


@dataclass(frozen=True, slots=True)
class StoredRun:
    location: str
    run: Run


def _filesystem(url: str, storage_options: dict[str, Any] | None = None) -> tuple[AbstractFileSystem, str]:
    try:
        filesystem, root = url_to_fs(url, **(storage_options or {}))
    except Exception as error:
        raise StorageError(f"cannot initialize results store {url!r}: {error}") from error
    return filesystem, root.rstrip("/")


def _safe_path_part(value: str) -> str:
    result = re.sub(r"[^A-Za-z0-9._-]+", "-", value).strip("-.")
    return result or "unknown"


def _run_path(root: str, run: Run) -> str:
    timestamp = run.started_at.replace("+00:00", "Z").replace(":", "").replace("-", "")
    revision = run.subject.revision or run.subject.version or run.suite.revision or "unknown"
    filename = f"{_safe_path_part(timestamp)}_{_safe_path_part(revision[:12])}_{_safe_path_part(run.run_id)}.json"
    return posixpath.join(root, _safe_path_part(run.machine.id), filename)


def _location(filesystem: AbstractFileSystem, path: str) -> str:
    return str(filesystem.unstrip_protocol(path))


def save_run(url: str, run: Run, *, storage_options: dict[str, Any] | None = None) -> str:
    Run.from_dict(run.to_dict())
    filesystem, root = _filesystem(url, storage_options)
    final_path = _run_path(root, run)
    if filesystem.exists(final_path):
        raise StorageError(f"run already exists: {_location(filesystem, final_path)}")
    directory = posixpath.dirname(final_path)
    filesystem.makedirs(directory, exist_ok=True)
    temporary_path = posixpath.join(directory, f".{posixpath.basename(final_path)}.{uuid4().hex}.tmp")
    payload = json.dumps(run.to_dict(), indent=2, sort_keys=False, ensure_ascii=True).encode() + b"\n"
    try:
        with filesystem.open(temporary_path, "wb") as file:
            file.write(payload)
        if filesystem.exists(final_path):
            raise StorageError(f"run already exists: {_location(filesystem, final_path)}")
        filesystem.mv(temporary_path, final_path)
    finally:
        if filesystem.exists(temporary_path):
            filesystem.rm(temporary_path)
    return _location(filesystem, final_path)


def _read_archive(filesystem: AbstractFileSystem, path: str) -> list[StoredRun]:
    location = _location(filesystem, path)
    try:
        with filesystem.open(path, "rt", compression="gzip", encoding="utf-8") as file:
            document = json.load(file)
        runs = document.get("runs") if isinstance(document, dict) else None
        if not isinstance(runs, list):
            raise StorageError(f"invalid archive at {location}: expected an object with a runs array")
        return [StoredRun(location=location, run=Run.from_dict(item)) for item in runs]
    except (OSError, ValueError, TypeError) as error:
        raise StorageError(f"invalid archive at {location}: {error}") from error


def read_runs(url: str, *, storage_options: dict[str, Any] | None = None) -> tuple[StoredRun, ...]:
    filesystem, root = _filesystem(url, storage_options)
    if not filesystem.exists(root):
        return ()
    stored: list[StoredRun] = []
    for path in sorted(filesystem.find(root)):
        if posixpath.basename(path).startswith("."):
            continue
        if path.endswith(".json.gz"):
            stored.extend(_read_archive(filesystem, path))
            continue
        if not path.endswith(".json"):
            continue
        try:
            with filesystem.open(path, "rt", encoding="utf-8") as file:
                run = Run.from_dict(json.load(file))
        except (OSError, ValueError, TypeError) as error:
            raise StorageError(f"invalid run document at {_location(filesystem, path)}: {error}") from error
        stored.append(StoredRun(location=_location(filesystem, path), run=run))
    return tuple(stored)


def compact_runs(url: str, *, keep: int, storage_options: dict[str, Any] | None = None) -> tuple[int, str]:
    if keep < 0:
        raise StorageError("keep must be non-negative")
    filesystem, root = _filesystem(url, storage_options)
    archive_path = posixpath.join(root, ARCHIVE_NAME)
    archive_location = _location(filesystem, archive_path)
    ordered = sorted(read_runs(url, storage_options=storage_options), key=lambda item: (item.run.ended_at, item.run.run_id))
    raw = [item for item in ordered if not item.location.endswith(".json.gz")]
    to_archive = raw[:-keep] if keep else raw
    if not to_archive:
        return 0, archive_location

    archived = {item.run.run_id: item for item in ordered if item.location.endswith(".json.gz")}
    archived.update((item.run.run_id, item) for item in to_archive)
    combined = sorted(archived.values(), key=lambda item: (item.run.ended_at, item.run.run_id))
    document = {"schema_version": ARCHIVE_SCHEMA_VERSION, "runs": [item.run.to_dict() for item in combined]}
    payload = json.dumps(document, indent=2, sort_keys=False, ensure_ascii=True).encode() + b"\n"
    temporary_path = posixpath.join(root, f".{ARCHIVE_NAME}.{uuid4().hex}.tmp")
    try:
        with filesystem.open(temporary_path, "wb", compression="gzip") as file:
            file.write(payload)
        if filesystem.exists(archive_path):
            filesystem.rm(archive_path)
        filesystem.mv(temporary_path, archive_path)
    finally:
        if filesystem.exists(temporary_path):
            filesystem.rm(temporary_path)
    for item in to_archive:
        filesystem.rm(item.location)
    return len(to_archive), archive_location


def resolve_run(url: str, selector: str, *, storage_options: dict[str, Any] | None = None) -> StoredRun:
    matches = [stored for stored in read_runs(url, storage_options=storage_options) if stored.run.run_id.startswith(selector)]
    if not matches:
        raise StorageError(f"no run matches {selector!r}")
    if len(matches) > 1:
        candidates = ", ".join(stored.run.run_id for stored in matches)
        raise StorageError(f"run selector {selector!r} is ambiguous: {candidates}")
    return matches[0]
