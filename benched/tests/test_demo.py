from dataclasses import replace
from pathlib import Path

import pytest

from benched.demo import backfill_demo
from benched.model import load_run
from benched.storage import read_runs, save_run

FIXTURES = Path(__file__).with_name("fixtures")


def test_backfills_deterministic_synthetic_history(tmp_path):
    results_dir = str(tmp_path / "results")
    current = load_run(FIXTURES / "canonical-run-v1.json")
    measurement = replace(
        current.measurements[0],
        stats={"median": 2.0, "mean": 2.1, "ops": 0.5, "rounds": 10},
        samples=(1.9, 2.1),
    )
    current = replace(current, measurements=(measurement,))
    save_run(results_dir, current)

    locations = backfill_demo(results_dir, count=3, seed=7)
    runs = [stored.run for stored in read_runs(results_dir)]

    assert len(locations) == 35
    assert len(runs) == 36
    assert current in runs
    synthetic = [run for run in runs if run.run_id != current.run_id]
    assert {run.provenance.source_format for run in synthetic} == {"benched-demo"}
    assert {run.subject.labels["synthetic"] for run in synthetic} == {"true"}
    assert {run.machine.id for run in runs} == {current.machine.id, "demo-linux-arm", "demo-linux-x86"}
    assert {machine: sum(run.machine.id == machine for run in runs) for machine in {run.machine.id for run in runs}} == {
        current.machine.id: 12,
        "demo-linux-arm": 12,
        "demo-linux-x86": 12,
    }
    assert {run.environment.python_version for run in runs} == {"3.10.0", "3.11.9", "3.12.0"}
    assert {run.machine.metadata.get("memory_gib") for run in runs if run.machine.id == "demo-linux-arm"} == {8.0}
    assert {run.machine.metadata.get("memory_gib") for run in runs if run.machine.id == "demo-linux-x86"} == {16.0}
    assert len({run.subject.version for run in runs}) == 4
    assert all(run.machine.labels["synthetic"] == "true" for run in synthetic if run.machine.id.startswith("demo-"))
    for run in synthetic:
        stats = run.measurements[0].stats
        median = stats["median"]
        ops = stats["ops"]
        assert isinstance(median, (int, float))
        assert isinstance(ops, (int, float))
        assert median * ops == pytest.approx(1.0)
        assert stats["rounds"] == 10
        assert run.measurements[0].samples is not None


def test_backfill_requires_current_run_and_positive_count(tmp_path):
    results_dir = str(tmp_path / "results")

    with pytest.raises(ValueError, match="current benchmark run"):
        backfill_demo(results_dir)

    current = load_run(FIXTURES / "canonical-run-v1.json")
    save_run(results_dir, current)
    with pytest.raises(ValueError, match="at least 1"):
        backfill_demo(results_dir, count=0)


def test_backfills_separate_demo_store_with_realistic_seconds(tmp_path):
    source_dir = str(tmp_path / "seed")
    output_dir = str(tmp_path / "demo")
    current = load_run(FIXTURES / "canonical-run-v1.json")
    save_run(source_dir, current)

    locations = backfill_demo(source_dir, output_dir=output_dir, count=1, seed=7)
    runs = [stored.run for stored in read_runs(output_dir)]

    assert len(locations) == len(runs) == 18
    assert {run.provenance.source_format for run in runs} == {"benched-demo"}
    medians = [measurement.stats["median"] for run in runs for measurement in run.measurements]
    assert min(medians) > 1.0
    assert max(medians) < 6.0
