from __future__ import annotations

import csv
import json
from collections.abc import Sequence
from pathlib import Path
from typing import Any

from .model import Measurement, Run
from .query import RunFilters, filter_measurements

FIXED_COLUMNS = (
    "run_id",
    "started_at",
    "ended_at",
    "status",
    "machine_id",
    "subject_name",
    "subject_version",
    "subject_revision",
    "python_version",
    "benchmark_id",
    "nodeid",
    "name",
    "group",
    "parameter_id",
    "unit",
)


class ExportError(ValueError):
    """Raised when benchmark history cannot be exported as a table."""


def tabulate(runs: Sequence[Run], *, filters: RunFilters | None = None) -> tuple[tuple[str, ...], tuple[dict[str, Any], ...]]:
    active = filters or RunFilters()
    parameter_names: set[str] = set()
    stat_names: set[str] = set()
    selected: list[tuple[Run, Measurement]] = []
    for run in runs:
        for measurement in filter_measurements(run, active):
            parameter_names.update(measurement.parameters)
            stat_names.update(measurement.stats)
            selected.append((run, measurement))
    if not selected:
        raise ExportError("no measurements match the current filters")
    collisions = sorted((parameter_names | stat_names) & set(FIXED_COLUMNS) | (parameter_names & stat_names))
    if collisions:
        raise ExportError(f"column names collide: {', '.join(collisions)}")

    columns = (*FIXED_COLUMNS, *sorted(parameter_names), *sorted(stat_names))
    rows: list[dict[str, Any]] = []
    for run, measurement in selected:
        row: dict[str, Any] = dict.fromkeys(columns)
        row.update(
            run_id=run.run_id,
            started_at=run.started_at,
            ended_at=run.ended_at,
            status=run.status,
            machine_id=run.machine.id,
            subject_name=run.subject.name,
            subject_version=run.subject.version,
            subject_revision=run.subject.revision,
            python_version=run.environment.python_version,
            benchmark_id=measurement.benchmark_id,
            nodeid=measurement.nodeid,
            name=measurement.name,
            group=measurement.group,
            parameter_id=measurement.parameter_id,
            unit=measurement.unit,
        )
        row.update(measurement.parameters)
        row.update(measurement.stats)
        rows.append(row)
    return columns, tuple(rows)


def _scalar(value: Any) -> Any:
    if isinstance(value, (list, tuple, dict)):
        return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=True)
    return value


def write_csv(path: Path, columns: tuple[str, ...], rows: Sequence[dict[str, Any]]) -> None:
    with path.open("w", encoding="utf-8", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(columns)
        for row in rows:
            writer.writerow([_scalar(row[column]) for column in columns])


def write_parquet(path: Path, columns: tuple[str, ...], rows: Sequence[dict[str, Any]]) -> None:
    try:
        import pyarrow
        import pyarrow.parquet
    except ImportError as error:
        raise ExportError("parquet export requires pyarrow; install benched[export]") from error
    arrays = {}
    for column in columns:
        values = [_scalar(row[column]) for row in rows]
        try:
            arrays[column] = pyarrow.array(values)
        except (pyarrow.ArrowInvalid, pyarrow.ArrowTypeError) as error:
            raise ExportError(f"column {column!r} mixes incompatible types: {error}") from error
    pyarrow.parquet.write_table(pyarrow.table(arrays), path)
