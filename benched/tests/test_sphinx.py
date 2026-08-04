import json
import shutil
from dataclasses import replace
from pathlib import Path

from sphinx.cmd.build import build_main
from yardang.cli import build as yardang_build

from benched.demo import backfill_demo
from benched.model import load_run
from benched.storage import read_runs, save_run

FIXTURES = Path(__file__).with_name("fixtures")
PROJECT_ROOT = Path(__file__).parents[2]


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


def test_project_documentation_builds_with_embedded_report(tmp_path, monkeypatch):
    output = tmp_path / "html"
    seed = PROJECT_ROOT / "build" / "docs-seed-results"
    results = PROJECT_ROOT / "build" / "docs-results"
    shutil.rmtree(seed, ignore_errors=True)
    shutil.rmtree(results, ignore_errors=True)
    save_run(str(seed), load_run(FIXTURES / "canonical-run-v1.json"))
    backfill_demo(str(seed), output_dir=str(results), count=3, seed=7)
    monkeypatch.chdir(PROJECT_ROOT)

    yardang_build(output=str(output))

    example_page = output.joinpath("docs/overview.html").read_text(encoding="utf-8")
    assert "Benched report example" in example_page
    assert "<benched-report " in example_page
    assert 'view="trend" metric="median" x-axis="version"' in example_page
    customize_page = output.joinpath("docs/how-to/customize-sphinx-report.html").read_text(encoding="utf-8")
    assert "<benched-report " in customize_page
    assert 'view="trend" metric="median" x-axis="version"' in customize_page
    assert output.joinpath("docs/how-to/import-pytest-benchmark.html").is_file()
    assert output.joinpath("docs/how-to/migrate-from-asv.html").is_file()
    assert output.joinpath("docs/how-to/run-in-prepared-environments.html").is_file()
    assert output.joinpath("_static/benched/benched.js").is_file()
    assert output.joinpath("_static/benched/benched.css").is_file()
    report_path = next(output.glob("_static/benched/reports/docs-results-*.json"))
    report = json.loads(report_path.read_text(encoding="utf-8"))
    assert len(report["source_run_ids"]) == len(read_runs(str(results))) == 60
    assert {run["machine"]["id"] for run in report["runs"]} == {
        "ci",
        "demo-linux-arm",
        "demo-linux-x86",
        "demo-macos-arm",
        "demo-windows-x86",
    }
    assert {run["environment"]["python_version"] for run in report["runs"]} == {"3.10.0", "3.11.9", "3.12.0"}
