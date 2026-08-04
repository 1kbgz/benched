import json
from dataclasses import replace
from io import StringIO
from pathlib import Path

import pytest
from jsonschema import Draft202012Validator

from benched.config import load_config
from benched.hooks import create_plugin_manager, hookimpl
from benched.model import load_run, schema_path
from benched.query import RunFilters
from benched.report import ReportError, compile_report, generate_report

FIXTURES = Path(__file__).with_name("fixtures")


def _runs():
    source = load_run(FIXTURES / "canonical-run-v1.json")
    first = replace(
        source,
        run_id="first",
        started_at="2026-01-01T01:59:59+02:00",
        ended_at="2026-01-01T02:00:00+02:00",
        measurements=(replace(source.measurements[0], stats={"median": 0.2, "mean": 0.3}),),
    )
    second = replace(
        source,
        run_id="second",
        started_at="2026-01-01T00:29:59+00:00",
        ended_at="2026-01-01T00:30:00+00:00",
        measurements=(replace(source.measurements[0], stats={"median": 0.1, "mean": 0.15}),),
    )
    return first, second


def test_report_is_deterministic_across_input_order_and_timezones():
    first, second = _runs()

    forward = compile_report((first, second)).to_dict()
    reverse = compile_report((second, first)).to_dict()

    assert forward == reverse
    assert forward["generated_at"] == "2026-01-01T00:30:00+00:00"
    assert forward["source_run_ids"] == ["first", "second"]
    assert forward["runs"][0]["machine"]["metadata"] == first.machine.metadata
    assert [point["metrics"]["median"] for point in forward["benchmarks"][0]["series"]] == [0.2, 0.1]
    Draft202012Validator(json.loads(schema_path("report").read_text(encoding="utf-8"))).validate(forward)


def test_report_applies_measurement_filters():
    first, second = _runs()

    report = compile_report((first, second), filters=RunFilters(group="parse", parameters={"size": 100}))

    assert len(report.benchmarks) == 1


def test_report_rejects_empty_selection():
    with pytest.raises(ReportError, match="no runs selected"):
        compile_report(())


def test_report_rejects_filters_without_measurements():
    with pytest.raises(ReportError, match="no measurements match"):
        compile_report(_runs(), filters=RunFilters(group="missing"))


def test_report_hooks_execute_once_around_reporters(tmp_path):
    calls = []

    class Plugin:
        @hookimpl
        def benched_before_report(self, context):
            calls.append("before")
            context.runs.pop(0)

        @hookimpl
        def benched_after_report(self, context):
            calls.append("after")
            assert context.report.source_run_ids == ("second",)
            assert context.artifacts == [tmp_path / "report.json"]

    manager = create_plugin_manager(load_entrypoints=False)
    manager.register(Plugin(), name="report-plugin")

    report, artifacts = generate_report(
        load_config(start=tmp_path, environ={}),
        _runs(),
        filters=RunFilters(),
        reporter_names=("json",),
        output=tmp_path,
        metric="median",
        stream=StringIO(),
        plugin_manager=manager,
    )

    assert calls == ["before", "after"]
    assert report.source_run_ids == ("second",)
    assert [artifact.path for artifact in artifacts] == [tmp_path / "report.json"]
