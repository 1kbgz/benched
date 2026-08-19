from __future__ import annotations

import json
from collections.abc import Mapping
from dataclasses import dataclass, field, replace
from fnmatch import fnmatchcase
from typing import Any
from urllib.parse import quote

from .model import Measurement, Run
from .storage import StoredRun

PEAK_MEMORY_SUFFIX = ":peak-memory"


class QueryError(ValueError):
    """Raised when run filters or selectors do not resolve deterministically."""


def encode_benchmark_id(base: str, parameters: Mapping[str, Any]) -> str:
    if not parameters:
        return base
    encoded = "&".join(
        f"{quote(str(name), safe='')}={quote(json.dumps(value, sort_keys=True, separators=(',', ':'), ensure_ascii=True), safe='')}"
        for name, value in sorted(parameters.items())
    )
    return f"{base}|{encoded}"


def split_benchmark_id(benchmark_id: str) -> tuple[str, str]:
    base, suffix = benchmark_id, ""
    if base.endswith(PEAK_MEMORY_SUFFIX):
        base, suffix = base[: -len(PEAK_MEMORY_SUFFIX)], PEAK_MEMORY_SUFFIX
    return base.split("|", 1)[0], suffix


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


def latest_measurements(stored_runs: tuple[StoredRun, ...], filters: RunFilters | None = None) -> tuple[StoredRun, ...]:
    active = replace(filters or RunFilters(), statuses=("success",))
    selected = filter_runs(stored_runs, active)
    latest: dict[str, str] = {}
    for stored in selected:
        for measurement in filter_measurements(stored.run, active):
            latest[measurement.benchmark_id] = stored.run.run_id
    if not latest:
        raise QueryError("no successful measurements match the current filters")

    coalesced: list[StoredRun] = []
    for stored in selected:
        measurements = tuple(
            measurement for measurement in filter_measurements(stored.run, active) if latest[measurement.benchmark_id] == stored.run.run_id
        )
        if measurements:
            coalesced.append(replace(stored, run=replace(stored.run, measurements=measurements)))
    return tuple(coalesced)


def _alias_measurement(measurement: Measurement, benchmarks: Mapping[str, str], parameters: Mapping[str, str]) -> Measurement:
    renamed = {parameters.get(key, key): value for key, value in measurement.parameters.items()}
    if len(renamed) != len(measurement.parameters):
        raise QueryError(f"parameter aliases collapse distinct parameters on {measurement.benchmark_id}")
    base, suffix = split_benchmark_id(measurement.benchmark_id)
    target = benchmarks.get(base)
    if target is None and renamed == measurement.parameters:
        return measurement
    changes: dict[str, Any] = {
        "parameters": renamed,
        "benchmark_id": encode_benchmark_id(target or base, renamed) + suffix,
    }
    if target is not None:
        if measurement.nodeid == base:
            changes["nodeid"] = target
        elif measurement.nodeid.startswith(f"{base}["):
            changes["nodeid"] = target + measurement.nodeid[len(base) :]
        if measurement.name == base:
            changes["name"] = target
    return replace(measurement, **changes)


def apply_aliases(
    stored_runs: tuple[StoredRun, ...],
    *,
    benchmarks: Mapping[str, str] | None = None,
    parameters: Mapping[str, str] | None = None,
) -> tuple[StoredRun, ...]:
    if not benchmarks and not parameters:
        return stored_runs
    aliased: list[StoredRun] = []
    for stored in stored_runs:
        measurements = tuple(_alias_measurement(measurement, benchmarks or {}, parameters or {}) for measurement in stored.run.measurements)
        if measurements != stored.run.measurements:
            stored = replace(stored, run=replace(stored.run, measurements=measurements))
        aliased.append(stored)
    return tuple(aliased)


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
