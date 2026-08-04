import json
from datetime import UTC, datetime, timedelta

import pytest

from benched.ingest import normalize_pytest_benchmark
from benched.model import EnvironmentInfo, Identity, MachineInfo, Measurement, Provenance, Run, ToolInfo
from benched.query import RunFilters, filter_runs
from benched.report import compile_report
from benched.storage import StoredRun


@pytest.fixture(scope="session")
def history() -> tuple[Run, ...]:
    started = datetime(2026, 1, 1, tzinfo=UTC)
    runs = []
    for index in range(100):
        timestamp = (started + timedelta(hours=index)).isoformat()
        runs.append(
            Run(
                run_id=f"run-{index:03d}",
                started_at=timestamp,
                ended_at=(started + timedelta(hours=index, seconds=1)).isoformat(),
                status="success",
                exit_code=0,
                suite=Identity(name="benched", revision=f"suite-{index:03d}"),
                subject=Identity(name="benched", version="0.1.0", revision=f"subject-{index:03d}"),
                machine=MachineInfo(id=f"machine-{index % 2}", fingerprint=f"machine-{index % 2}"),
                environment=EnvironmentInfo(
                    fingerprint="cpython-3.12",
                    python_implementation="CPython",
                    python_version="3.12.0",
                    platform="benchmark",
                    architecture="native",
                ),
                tool=ToolInfo(benched="0.1.0", pytest=pytest.__version__, pytest_benchmark="5.2.3"),
                measurements=(
                    Measurement(
                        benchmark_id="benched.report.compile",
                        nodeid="benchmarks/test_benched.py::test_compile_report",
                        name="test_compile_report",
                        group="report",
                        unit="seconds",
                        stats={"median": 0.001 + index / 1_000_000, "mean": 0.0011 + index / 1_000_000},
                    ),
                ),
                provenance=Provenance(source_format="benched-demo"),
            )
        )
    return tuple(runs)


@pytest.fixture(scope="session")
def large_history() -> tuple[Run, ...]:
    started = datetime(2026, 1, 1, tzinfo=UTC)
    machines = (
        ("linux-arm", "Linux", "arm64", 8.0),
        ("linux-x86", "Linux", "x86_64", 16.0),
        ("macos-arm", "Darwin", "arm64", 32.0),
        ("windows-x86", "Windows", "AMD64", 24.0),
        ("cloud-x86", "Linux", "x86_64", 4.0),
    )
    python_versions = ("3.11.9", "3.12.13", "3.13.7")
    runs = []
    for revision in range(100):
        timestamp = (started + timedelta(days=revision)).isoformat()
        machine_id, platform, architecture, memory_gib = machines[revision % len(machines)]
        python_version = python_versions[revision % len(python_versions)]
        measurements = tuple(
            Measurement(
                benchmark_id=f"benched.report.compile|case={case}",
                nodeid=f"benchmarks/test_benched.py::test_compile_report[{case}]",
                name=f"test_compile_report[{case}]",
                group="report",
                parameters={"case": case},
                unit="seconds",
                stats={
                    "median": (case + 1) / 100_000 * (1 + revision / 1_000),
                    "mean": (case + 1) / 95_000 * (1 + revision / 1_000),
                },
            )
            for case in range(1_000)
        )
        runs.append(
            Run(
                run_id=f"large-run-{revision:03d}",
                started_at=timestamp,
                ended_at=(started + timedelta(days=revision, seconds=1)).isoformat(),
                status="success",
                exit_code=0,
                suite=Identity(name="benched", revision=f"suite-{revision:03d}"),
                subject=Identity(name="benched", version=f"0.{revision}.0", revision=f"subject-{revision:03d}"),
                machine=MachineInfo(
                    id=machine_id,
                    fingerprint=machine_id,
                    metadata={"memory_gib": memory_gib},
                ),
                environment=EnvironmentInfo(
                    fingerprint=f"cpython-{python_version}-{platform}-{architecture}",
                    python_implementation="CPython",
                    python_version=python_version,
                    platform=platform,
                    architecture=architecture,
                ),
                tool=ToolInfo(benched="0.1.0", pytest=pytest.__version__, pytest_benchmark="5.2.3"),
                measurements=measurements,
                provenance=Provenance(source_format="benched-benchmark"),
            )
        )
    return tuple(runs)


@pytest.fixture(scope="session")
def large_report(large_history):
    return compile_report(large_history)


@pytest.fixture(scope="session")
def pytest_benchmark_document() -> dict[str, object]:
    return {
        "version": "5.2.3",
        "benchmarks": [
            {
                "fullname": "benchmarks/test_example.py::test_parse[100]",
                "name": "test_parse[100]",
                "group": "parse",
                "param": "100",
                "params": {"size": 100},
                "options": {"min_rounds": 5},
                "extra_info": {},
                "stats": {"min": 0.0001, "max": 0.0002, "mean": 0.00013, "median": 0.00012, "rounds": 10},
            }
        ],
    }


@pytest.mark.benchmark(group="report")
@pytest.mark.parametrize("run_count", [10, 100])
def test_compile_report(benchmark, large_history, run_count):
    report = benchmark(compile_report, large_history[:run_count])

    assert len(report.source_run_ids) == run_count
    assert len(report.benchmarks) == 1_000


@pytest.mark.benchmark(group="report")
def test_serialize_report(benchmark, large_report):
    payload = benchmark(json.dumps, large_report.to_dict(), indent=2, ensure_ascii=True)

    assert len(payload) > 1_000_000


@pytest.mark.benchmark(group="query")
def test_filter_history(benchmark, history):
    stored = tuple(StoredRun(location=f"memory://{run.run_id}.json", run=run) for run in history)

    selected = benchmark(filter_runs, stored, RunFilters(machine="machine-1", statuses=("success",)))

    assert len(selected) == 50


@pytest.mark.benchmark(group="ingest")
def test_normalize_pytest_benchmark(benchmark, pytest_benchmark_document, history):
    reference = history[0]
    run = benchmark(
        normalize_pytest_benchmark,
        pytest_benchmark_document,
        started_at=reference.started_at,
        ended_at=reference.ended_at,
        exit_code=0,
        suite=reference.suite,
        subject=reference.subject,
        machine=reference.machine,
        environment=reference.environment,
        run_id="benchmark-run",
    )

    assert len(run.measurements) == 1
