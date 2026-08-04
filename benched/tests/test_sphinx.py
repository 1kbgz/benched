import json
import shutil
from dataclasses import replace
from pathlib import Path

from sphinx.cmd.build import build_main

from benched.model import load_run
from benched.storage import save_run

FIXTURES = Path(__file__).with_name("fixtures")


def _configuration(source: Path) -> None:
    source.joinpath("conf.py").write_text(
        'extensions = ["benched.sphinx"]\nmaster_doc = "index"\nproject = "example"\n',
        encoding="utf-8",
    )


def test_sphinx_embeds_multiple_prepared_reports_with_relative_assets(tmp_path):
    source = tmp_path / "docs"
    nested = source / "nested"
    output = tmp_path / "html"
    nested.mkdir(parents=True)
    _configuration(source)
    shutil.copyfile(FIXTURES / "canonical-report-v1.json", tmp_path / "report.json")
    source.joinpath("index.rst").write_text("Reports\n=======\n\n.. toctree::\n\n   nested/report\n", encoding="utf-8")
    nested.joinpath("report.rst").write_text(
        """Benchmarks
==========

.. benched:: ../../report.json
   :view: trend
   :metric: mean
   :x-axis: time
   :python: 3.11,3.12
   :memory: 16,32
   :benchmark: tests/test_parse.py::test_parse|size=100

.. benched:: ../../report.json
   :view: overview
""",
        encoding="utf-8",
    )

    assert build_main(["-W", "-b", "html", str(source), str(output)]) == 0

    page = output.joinpath("nested/report.html").read_text(encoding="utf-8")
    reports = list(output.glob("_static/benched/reports/report-*.json"))
    assert page.count("<benched-report ") == 2
    assert 'view="trend" metric="mean" x-axis="time"' in page
    assert 'python="3.11,3.12" memory="16,32"' in page
    assert 'src="../_static/benched/reports/report-' in page
    assert page.count("benched/benched.js") == 1
    assert len(reports) == 1
    assert output.joinpath("_static/benched/benched.js").is_file()
    assert output.joinpath("_static/benched/benched.css").is_file()


def test_sphinx_compiles_existing_results_with_selectors(tmp_path):
    source = tmp_path / "docs"
    output = tmp_path / "html"
    results = source / "results"
    source.mkdir()
    _configuration(source)
    run = load_run(FIXTURES / "canonical-run-v1.json")
    save_run(str(results), replace(run, run_id="first", started_at="2026-01-01T00:00:00+00:00", ended_at="2026-01-01T00:00:01+00:00"))
    save_run(str(results), replace(run, run_id="second", started_at="2026-01-02T00:00:00+00:00", ended_at="2026-01-02T00:00:01+00:00"))
    source.joinpath("index.rst").write_text(
        """Report
======

.. benched:: results
   :selector: latest
   :view: comparison
""",
        encoding="utf-8",
    )

    assert build_main(["-W", "-b", "html", str(source), str(output)]) == 0

    report_path = next(output.glob("_static/benched/reports/results-*.json"))
    assert json.loads(report_path.read_text(encoding="utf-8"))["source_run_ids"] == ["second"]


def test_sphinx_transforms_report_before_writing_static_data(tmp_path):
    source = tmp_path / "docs"
    output = tmp_path / "html"
    source.mkdir()
    shutil.copyfile(FIXTURES / "canonical-report-v1.json", source / "report.json")
    source.joinpath("conf.py").write_text(
        """extensions = ["benched.sphinx"]
master_doc = "index"
project = "example"

def transform_report(app, report, options):
    data = report.to_dict()
    data["benchmarks"][0]["name"] = "Published benchmark"
    data["warnings"].append(f"Prepared for {options.get('view', 'overview')}")
    return data

def setup(app):
    app.connect("benched-process-report", transform_report)
""",
        encoding="utf-8",
    )
    source.joinpath("index.rst").write_text(
        """Report
======

.. benched:: report.json
   :view: trend
""",
        encoding="utf-8",
    )

    assert build_main(["-W", "-b", "html", str(source), str(output)]) == 0

    report_path = next(output.glob("_static/benched/reports/report-*.json"))
    report = json.loads(report_path.read_text(encoding="utf-8"))
    assert report["benchmarks"][0]["name"] == "Published benchmark"
    assert report["warnings"] == ["Prepared for trend"]
