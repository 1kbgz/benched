from __future__ import annotations

from dataclasses import dataclass, field
from fnmatch import fnmatchcase
from typing import Any

from .model import Measurement, Run
from .storage import StoredRun


class QueryError(ValueError):
    """Raised when run filters or selectors do not resolve deterministically."""


@dataclass(frozen=True, slots=True)
class RunFilters:
    subject: str | None = None
    machine: str | None = None
    python: str | None = None
    statuses: tuple[str, ...] = ()
    benchmark: str | None = None
    group: str | None = None
    parameters: dict[str, Any] = field(default_factory=dict)


def filter_measurements(run: Run, filters: RunFilters) -> tuple[Measurement, ...]:
    measurements: list[Measurement] = []
    for measurement in run.measurements:
        if filters.benchmark is not None:
            pattern = filters.benchmark
            values = (measurement.benchmark_id, measurement.nodeid, measurement.name)
            if pattern not in values and not any(fnmatchcase(value, pattern) for value in values):
                continue
        if filters.group is not None and measurement.group != filters.group:
            continue
        if any(key not in measurement.parameters or measurement.parameters[key] != value for key, value in filters.parameters.items()):
            continue
        measurements.append(measurement)
    return tuple(measurements)


def filter_runs(stored_runs: tuple[StoredRun, ...], filters: RunFilters | None = None) -> tuple[StoredRun, ...]:
    selected: list[StoredRun] = []
    active = filters or RunFilters()
    measurement_filters = active.benchmark is not None or active.group is not None or bool(active.parameters)
    for stored in stored_runs:
        run = stored.run
        if active.subject is not None and run.subject.name != active.subject:
            continue
        if active.machine is not None and run.machine.id != active.machine:
            continue
        if active.python is not None and run.environment.python_version != active.python:
            continue
        if active.statuses and run.status not in active.statuses:
            continue
        if measurement_filters and not filter_measurements(run, active):
            continue
        selected.append(stored)
    return tuple(sorted(selected, key=lambda item: (item.run.ended_at, item.run.run_id)))


def _identity_match(run: Run, selector: str) -> bool:
    if "=" in selector:
        key, value = selector.split("=", 1)
        return run.subject.labels.get(key) == value or run.suite.labels.get(key) == value
    return any(
        (
            identity.revision is not None
            and identity.revision.startswith(selector)
            or identity.version == selector
            or identity.branch == selector
            or selector in identity.labels.values()
        )
        for identity in (run.subject, run.suite)
    )


def resolve_selector(stored_runs: tuple[StoredRun, ...], selector: str, *, filters: RunFilters | None = None) -> StoredRun:
    selected = filter_runs(stored_runs, filters)
    if not selected:
        raise QueryError("no runs match the current filters")

    if selector in {"latest", "previous"}:
        successful = [stored for stored in selected if stored.run.status == "success"]
        offset = 1 if selector == "latest" else 2
        if len(successful) < offset:
            raise QueryError(f"{selector} requires at least {offset} successful matching run{'s' if offset != 1 else ''}")
        return successful[-offset]

    exact = [stored for stored in selected if stored.run.run_id == selector]
    if exact:
        return exact[0]
    prefixes = [stored for stored in selected if stored.run.run_id.startswith(selector)]
    if prefixes:
        return _one(prefixes, selector)

    identities = [stored for stored in selected if stored.run.status == "success" and _identity_match(stored.run, selector)]
    if identities:
        return _one(identities, selector)
    raise QueryError(f"no run matches selector {selector!r}")


def _one(matches: list[StoredRun], selector: str) -> StoredRun:
    if len(matches) > 1:
        candidates = ", ".join(stored.run.run_id for stored in matches)
        raise QueryError(f"run selector {selector!r} is ambiguous: {candidates}")
    return matches[0]
