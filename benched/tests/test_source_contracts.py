import json
from pathlib import Path

FIXTURES = Path(__file__).with_name("fixtures")


def test_pytest_benchmark_contract_fixture():
    data = json.loads((FIXTURES / "pytest-benchmark-v5.json").read_text(encoding="utf-8"))

    assert data["version"].startswith("5.")
    assert data["commit_info"]["id"]
    assert data["machine_info"]["python_version"]
    assert data["benchmarks"][0]["params"] == {"size": 100}
    assert data["benchmarks"][0]["stats"]["median"] == 0.00012
