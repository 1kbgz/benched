import json
from pathlib import Path

import pytest

from benched.ingest import IngestError, normalize_pytest_benchmark
from benched.model import EnvironmentInfo, Identity, MachineInfo

FIXTURES = Path(__file__).with_name("fixtures")


def _context():
    return {
        "started_at": "2026-08-04T12:00:00+00:00",
        "ended_at": "2026-08-04T12:00:01+00:00",
        "exit_code": 0,
        "suite": Identity(name="suite", revision="abc123"),
        "subject": Identity(name="subject", version="1.2.3"),
        "machine": MachineInfo(id="local", fingerprint="machine"),
        "environment": EnvironmentInfo(
            fingerprint="environment",
            python_implementation="CPython",
            python_version="3.12.0",
            platform="Darwin",
            architecture="arm64",
        ),
        "run_id": "run-id",
    }


def test_normalizes_parameterized_pytest_benchmark():
    source = json.loads((FIXTURES / "pytest-benchmark-v5.json").read_text(encoding="utf-8"))

    run = normalize_pytest_benchmark(source, **_context())

    assert run.status == "success"
    assert run.suite.revision == "abc123"
    assert run.subject.version == "1.2.3"
    assert len(run.measurements) == 1
    measurement = run.measurements[0]
    assert measurement.benchmark_id == "tests/test_parse.py::test_parse|size=100"
    assert measurement.parameter_id == "100"
    assert measurement.parameters == {"size": 100}
    assert measurement.stats["median"] == 0.00012
    assert measurement.samples is None


def test_normalizes_peak_memory_as_sibling_measurement():
    source = json.loads((FIXTURES / "pytest-benchmark-v5.json").read_text(encoding="utf-8"))
    source["benchmarks"][0]["extra_info"]["peak_memory_bytes"] = 67_108_864

    run = normalize_pytest_benchmark(source, **_context())

    timing, memory = run.measurements
    assert memory.benchmark_id == f"{timing.benchmark_id}:peak-memory"
    assert memory.nodeid == timing.nodeid
    assert memory.name == f"{timing.name} peak memory"
    assert memory.parameters == timing.parameters
    assert memory.unit == "bytes"
    assert memory.stats == {"peak_memory": 67_108_864}


def test_raw_samples_are_opt_in():
    source = json.loads((FIXTURES / "pytest-benchmark-v5.json").read_text(encoding="utf-8"))
    source["benchmarks"][0]["stats"]["data"] = [0.1, 0.2]

    without_samples = normalize_pytest_benchmark(source, **_context())
    with_samples = normalize_pytest_benchmark(source, save_samples=True, **_context())

    assert without_samples.measurements[0].samples is None
    assert with_samples.measurements[0].samples == (0.1, 0.2)


def test_rejects_unknown_pytest_benchmark_json_version():
    source = json.loads((FIXTURES / "pytest-benchmark-v5.json").read_text(encoding="utf-8"))
    source["version"] = "6.0.0"

    with pytest.raises(IngestError, match="expected version 5.x"):
        normalize_pytest_benchmark(source, **_context())


def test_benchmark_id_uses_named_values_not_parameter_order():
    source = json.loads((FIXTURES / "pytest-benchmark-v5.json").read_text(encoding="utf-8"))
    source["benchmarks"][0]["fullname"] = "tests/test_parse.py::test_parse[case]"
    source["benchmarks"][0]["param"] = "case"
    source["benchmarks"][0]["params"] = {"right": 2, "left": 1}
    first = normalize_pytest_benchmark(source, **_context())
    source["benchmarks"][0]["params"] = {"left": 1, "right": 2}
    second = normalize_pytest_benchmark(source, **_context())

    assert first.measurements[0].benchmark_id == second.measurements[0].benchmark_id

    source["benchmarks"][0]["params"] = {"left": 1, "right": 3}
    different = normalize_pytest_benchmark(source, **_context())
    assert first.measurements[0].benchmark_id != different.measurements[0].benchmark_id
