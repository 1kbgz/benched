from __future__ import annotations

import hashlib
import json
import math
import os
import platform
import subprocess
from collections.abc import Mapping
from dataclasses import dataclass
from importlib import metadata
from pathlib import Path
from typing import Any

from .config import Config
from .model import EnvironmentInfo, Identity, MachineInfo


@dataclass(frozen=True, slots=True)
class GitInfo:
    revision: str | None
    branch: str | None
    dirty: bool | None


def _git(project_root: Path, *args: str) -> str | None:
    result = subprocess.run(
        ["git", *args],
        cwd=project_root,
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode != 0:
        return None
    return result.stdout.strip() or None


def git_info(project_root: Path) -> GitInfo:
    revision = _git(project_root, "rev-parse", "HEAD")
    if revision is None:
        return GitInfo(revision=None, branch=None, dirty=None)
    branch = _git(project_root, "branch", "--show-current")
    dirty = bool(_git(project_root, "status", "--porcelain"))
    return GitInfo(revision=revision, branch=branch, dirty=dirty)


def _installed_version(distribution: str | None) -> str | None:
    if distribution is None:
        return None
    try:
        return metadata.version(distribution)
    except metadata.PackageNotFoundError:
        return None


def resolve_identities(
    config: Config,
    *,
    suite_revision: str | None = None,
    subject_version: str | None = None,
    subject_revision: str | None = None,
    suite_labels: Mapping[str, str] | None = None,
    subject_labels: Mapping[str, str] | None = None,
) -> tuple[Identity, Identity]:
    git = git_info(config.project_root)
    same_subject = config.subject.name == config.suite.name and config.subject.repository == config.suite.repository
    suite = Identity(
        name=config.suite.name,
        repository=config.suite.repository,
        version=config.project_version,
        revision=suite_revision or git.revision,
        branch=git.branch,
        dirty=git.dirty,
        labels=dict(suite_labels or {}),
    )
    subject = Identity(
        name=config.subject.name,
        repository=config.subject.repository,
        version=subject_version or _installed_version(config.subject.distribution) or (config.project_version if same_subject else None),
        revision=subject_revision or (git.revision if same_subject else None),
        branch=git.branch if same_subject else None,
        dirty=git.dirty if same_subject else None,
        labels=dict(subject_labels or {}),
    )
    return suite, subject


def _fingerprint(value: Mapping[str, Any]) -> str:
    payload = json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=True)
    return hashlib.sha256(payload.encode()).hexdigest()


def _total_memory_bytes() -> int | None:
    try:
        pages = os.sysconf("SC_PHYS_PAGES")
        page_size = os.sysconf("SC_PAGE_SIZE")
    except (AttributeError, OSError, ValueError):
        return None
    if not isinstance(pages, int) or not isinstance(page_size, int) or pages <= 0 or page_size <= 0:
        return None
    return pages * page_size


def _memory_gib(total_bytes: int) -> float:
    return math.floor((total_bytes / 1024**3) * 2 + 0.5) / 2


def resolve_machine(machine_id: str | None = None, *, labels: Mapping[str, str] | None = None) -> MachineInfo:
    machine_metadata = {
        "system": platform.system(),
        "release": platform.release(),
        "architecture": platform.machine(),
        "processor": platform.processor(),
        "cpu_count": os.cpu_count(),
    }
    if (total_memory := _total_memory_bytes()) is not None:
        machine_metadata["memory_gib"] = _memory_gib(total_memory)
    return MachineInfo(
        id=machine_id or platform.node() or "local",
        fingerprint=_fingerprint(machine_metadata),
        metadata=machine_metadata,
        labels=dict(labels or {}),
    )


def resolve_environment(*, labels: Mapping[str, str] | None = None) -> EnvironmentInfo:
    environment_labels = dict(labels or {})
    python_implementation = platform.python_implementation()
    python_version = platform.python_version()
    system = platform.system()
    architecture = platform.machine()
    fingerprint_values = {
        "python_implementation": python_implementation,
        "python_version": python_version,
        "platform": system,
        "architecture": architecture,
        "labels": environment_labels,
    }
    return EnvironmentInfo(
        fingerprint=_fingerprint(fingerprint_values),
        python_implementation=python_implementation,
        python_version=python_version,
        platform=system,
        architecture=architecture,
        labels=environment_labels,
    )
