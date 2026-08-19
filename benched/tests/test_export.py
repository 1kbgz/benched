import csv
from dataclasses import replace
from pathlib import Path

import pytest

from benched.export import ExportError, tabulate, write_csv
from benched.model import load_run
from benched.query import RunFilters, encode_benchmark_id

FIXTURES = Path(__file__).with_name("fixtures")


def _run(run_id="run-001", **parameter_sets):
    source = load_run(FIXTURES / "canonical-run-v1.json")
    template = source.measurements[0]
    measurements = (
        tuple(
            replace(
                template,
                benchmark_id=encode_benchmark_id(f"tests/test_{name}.py::test_{name}", parameters),
                nodeid=f"tests/test_{name}.py::test_{name}",
                name=name,
                parameters=parameters,
            )
            for name, parameters in parameter_sets.items()
        )
        or source.measurements
    )
    return replace(source, run_id=run_id, measurements=measurements)


def test_tabulate_keeps_rows_rectangular_across_parameter_sets():
    run = _run(parse={"size": 100}, solve={"solver": "mosek", "n_assets": 50})

    columns, rows = tabulate([run])

    assert columns[:3] == ("run_id", "started_at", "ended_at")
    assert columns[-9:] == ("n_assets", "size", "solver", "iterations", "max", "mean", "median", "min", "rounds")
    assert len(rows) == 2
    assert all(set(row) == set(columns) for row in rows)
    assert rows[0]["size"] == 100
    assert rows[0]["solver"] is None
    assert rows[1]["solver"] == "mosek"
    assert rows[1]["size"] is None
    assert rows[1]["median"] == 0.00012


def test_tabulate_rejects_empty_selection_and_column_collisions():
    with pytest.raises(ExportError, match="no measurements match"):
        tabulate([_run()], filters=RunFilters(group="missing"))

    with pytest.raises(ExportError, match="column names collide: unit"):
        tabulate([_run(parse={"unit": "seconds"})])


def test_write_csv_serializes_missing_and_structured_values(tmp_path):
    run = _run(parse={"size": 100}, solve={"shape": [10, 20]})
    columns, rows = tabulate([run])
    target = tmp_path / "export.csv"

    write_csv(target, columns, rows)

    with target.open(encoding="utf-8", newline="") as file:
        header, first, second = list(csv.reader(file))
    assert header == list(columns)
    assert first[header.index("size")] == "100"
    assert first[header.index("shape")] == ""
    assert second[header.index("shape")] == "[10,20]"


def test_write_parquet_round_trips_rows(tmp_path):
    pyarrow = pytest.importorskip("pyarrow")
    parquet = pytest.importorskip("pyarrow.parquet")
    from benched.export import write_parquet

    run = _run(parse={"size": 100}, solve={"solver": "mosek"})
    columns, rows = tabulate([run])
    target = tmp_path / "export.parquet"

    write_parquet(target, columns, rows)

    table = parquet.read_table(target)
    assert table.column_names == list(columns)
    assert table.num_rows == 2
    assert table.column("solver").to_pylist() == [None, "mosek"]
    assert isinstance(table, pyarrow.Table)
