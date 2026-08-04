import json

from benched import __version__
from benched.pytest_plugin import pytest_benchmark_update_json, pytest_collection_finish


def test_adds_benched_metadata_to_pytest_benchmark_json():
    output = {}

    pytest_benchmark_update_json(None, None, output)

    assert output == {"benched": {"version": __version__}}


def test_collects_only_benchmark_fixture_items(monkeypatch, tmp_path):
    class Item:
        def __init__(self, nodeid, fixturenames):
            self.nodeid = nodeid
            self.fixturenames = fixturenames

    class Session:
        def __init__(self):
            self.items = [Item("test_fast", ("benchmark",)), Item("test_other", ())]

    output_path = tmp_path / "nodeids.json"
    monkeypatch.setenv("BENCHED_COLLECTION_PATH", str(output_path))

    pytest_collection_finish(Session())

    assert json.loads(output_path.read_text(encoding="utf-8")) == ["test_fast"]
