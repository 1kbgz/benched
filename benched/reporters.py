from __future__ import annotations

import json
from dataclasses import dataclass
from importlib import metadata, resources
from pathlib import Path
from typing import Protocol, TextIO

from .model import Report


class ReporterError(RuntimeError):
    """Raised when a report renderer cannot be loaded or written."""


@dataclass(frozen=True, slots=True)
class ReportArtifact:
    kind: str
    path: Path


@dataclass(frozen=True, slots=True)
class ReporterOptions:
    output: Path
    metric: str
    stream: TextIO


class Reporter(Protocol):
    name: str

    def write(self, report: Report, options: ReporterOptions) -> tuple[ReportArtifact, ...]: ...


def _json(report: Report) -> str:
    return json.dumps(report.to_dict(), indent=2, ensure_ascii=True) + "\n"


class TerminalReporter:
    name = "terminal"

    def write(self, report: Report, options: ReporterOptions) -> tuple[ReportArtifact, ...]:
        print(f"report {len(report.source_run_ids)} runs  {len(report.benchmarks)} benchmarks  metric {options.metric}", file=options.stream)
        for benchmark in report.benchmarks:
            series = benchmark["series"]
            latest = series[-1]["metrics"].get(options.metric) if series else None
            value = "-" if latest is None else f"{latest:.6g}"
            print(f"{value:>12}  {benchmark['unit']:<10}  {benchmark['benchmark_id']}", file=options.stream)
        return ()


class JsonReporter:
    name = "json"

    def write(self, report: Report, options: ReporterOptions) -> tuple[ReportArtifact, ...]:
        options.output.mkdir(parents=True, exist_ok=True)
        path = options.output / "report.json"
        path.write_text(_json(report), encoding="utf-8")
        return (ReportArtifact(kind="json", path=path),)


class HtmlReporter:
    name = "html"

    def write(self, report: Report, options: ReporterOptions) -> tuple[ReportArtifact, ...]:
        data_directory = options.output / "data"
        assets_directory = options.output / "assets"
        data_directory.mkdir(parents=True, exist_ok=True)
        assets_directory.mkdir(parents=True, exist_ok=True)
        report_path = data_directory / "report.json"
        script_path = assets_directory / "benched.js"
        style_path = assets_directory / "benched.css"
        index_path = options.output / "index.html"
        report_path.write_text(_json(report), encoding="utf-8")
        extension = resources.files("benched").joinpath("extension")
        script_path.write_bytes(extension.joinpath("cdn/index.js").read_bytes())
        style_path.write_bytes(extension.joinpath("css/index.css").read_bytes())
        index_path.write_text(
            f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Benched report</title>
    <link rel="stylesheet" href="assets/benched.css">
    <script type="module" src="assets/benched.js"></script>
  </head>
  <body>
    <benched-report src="data/report.json" view="trend" metric="{options.metric}"></benched-report>
  </body>
</html>
""",
            encoding="utf-8",
        )
        return (
            ReportArtifact(kind="html", path=index_path),
            ReportArtifact(kind="json", path=report_path),
            ReportArtifact(kind="javascript", path=script_path),
            ReportArtifact(kind="css", path=style_path),
        )


def discover_reporters() -> dict[str, Reporter]:
    reporters: dict[str, Reporter] = {
        "terminal": TerminalReporter(),
        "json": JsonReporter(),
        "html": HtmlReporter(),
    }
    for entry_point in metadata.entry_points(group="benched.reporters"):
        if entry_point.name in reporters:
            raise ReporterError(f"reporter name {entry_point.name!r} is already registered")
        try:
            loaded = entry_point.load()
            reporter = loaded() if isinstance(loaded, type) else loaded
        except Exception as error:
            raise ReporterError(f"failed to load reporter {entry_point.name!r}: {error}") from error
        if not callable(getattr(reporter, "write", None)):
            raise ReporterError(f"reporter {entry_point.name!r} does not provide write(report, options)")
        reporters[entry_point.name] = reporter
    return reporters


def run_reporters(
    report: Report,
    names: tuple[str, ...],
    *,
    output: Path,
    metric: str,
    stream: TextIO,
    reporters: dict[str, Reporter] | None = None,
) -> tuple[ReportArtifact, ...]:
    available = reporters or discover_reporters()
    artifacts: list[ReportArtifact] = []
    options = ReporterOptions(output=output, metric=metric, stream=stream)
    for name in names:
        reporter = available.get(name)
        if reporter is None:
            raise ReporterError(f"unknown reporter {name!r}; available: {', '.join(sorted(available))}")
        try:
            artifacts.extend(reporter.write(report, options))
        except Exception as error:
            raise ReporterError(f"reporter {name!r} failed: {error}") from error
    return tuple(artifacts)
