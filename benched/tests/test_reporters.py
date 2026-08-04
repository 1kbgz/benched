import json
from io import StringIO
from pathlib import Path

import pytest

from benched.model import load_report
from benched.reporters import HtmlReporter, JsonReporter, ReporterError, ReporterOptions, TerminalReporter, discover_reporters, run_reporters

FIXTURES = Path(__file__).with_name("fixtures")


def _report():
    return load_report(FIXTURES / "canonical-report-v1.json")


def test_terminal_and_json_reporters_consume_same_report(tmp_path):
    stream = StringIO()

    artifacts = run_reporters(_report(), ("terminal", "json"), output=tmp_path, metric="median", stream=stream)

    assert [artifact.kind for artifact in artifacts] == ["json"]
    assert "tests/test_parse.py::test_parse|size=100" in stream.getvalue()
    assert json.loads((tmp_path / "report.json").read_text(encoding="utf-8")) == _report().to_dict()


def test_terminal_reporter_writes_selected_metric(tmp_path):
    stream = StringIO()
    options = ReporterOptions(output=tmp_path, metric="median", stream=stream)

    TerminalReporter().write(_report(), options)

    assert "0.00012" in stream.getvalue()


def test_html_reporter_writes_self_contained_static_shell(tmp_path):
    options = ReporterOptions(output=tmp_path, metric="median", stream=StringIO())

    artifacts = HtmlReporter().write(_report(), options)

    assert {artifact.path.relative_to(tmp_path).as_posix() for artifact in artifacts} == {
        "index.html",
        "data/report.json",
        "assets/benched.js",
        "assets/benched.css",
    }
    assert '<benched-report src="data/report.json" view="trend" metric="median">' in (tmp_path / "index.html").read_text(encoding="utf-8")
    assert json.loads((tmp_path / "data/report.json").read_text(encoding="utf-8")) == _report().to_dict()


def test_discovers_external_reporter(monkeypatch):
    class CustomReporter:
        name = "custom"

        def write(self, report, options):
            return ()

    class EntryPoint:
        name = "custom"

        @staticmethod
        def load():
            return CustomReporter

    monkeypatch.setattr("benched.reporters.metadata.entry_points", lambda **kwargs: (EntryPoint(),))

    assert isinstance(discover_reporters()["custom"], CustomReporter)


def test_builtin_reporter_types_are_public():
    assert JsonReporter.name == "json"


def test_failing_reporter_is_named(tmp_path):
    class BrokenReporter:
        name = "broken"

        def write(self, report, options):
            raise RuntimeError("cannot render")

    with pytest.raises(ReporterError, match="reporter 'broken' failed: cannot render"):
        run_reporters(
            _report(),
            ("broken",),
            output=tmp_path,
            metric="median",
            stream=StringIO(),
            reporters={"broken": BrokenReporter()},
        )

    assert list(tmp_path.iterdir()) == []
