from __future__ import annotations

import hashlib
import html
import json
import shlex
from importlib import resources
from pathlib import Path
from typing import Any

from docutils import nodes
from docutils.parsers.rst import Directive, directives
from sphinx.application import Sphinx
from sphinx.environment import BuildEnvironment
from sphinx.util.osutil import relative_uri

from .config import Config, load_config
from .model import Report, load_report
from .query import RunFilters, apply_aliases, filter_runs, latest_measurements, resolve_selector
from .report import compile_report
from .storage import read_runs

_VIEWS = ("overview", "trend", "comparison")
_METRICS = ("median", "mean", "min", "max", "ops", "peak_memory")
_X_AXES = ("version", "time")
_THEMES = ("inherit", "light", "dark")
_CONTROLS = ("view", "metric", "x-axis", "benchmark", "machine", "python", "memory", "theme")


class BenchedReportNode(nodes.General, nodes.Element):
    pass


def _choice(values: tuple[str, ...]):
    return lambda argument: directives.choice(argument, values)


def _controls(argument: str) -> str:
    values = tuple(value.strip() for value in argument.split(",") if value.strip())
    invalid = tuple(value for value in values if value not in _CONTROLS)
    if invalid:
        raise ValueError(f"unknown Benched controls: {', '.join(invalid)}")
    return ",".join(values)


def _source_url(argument: str, source_directory: Path) -> str:
    if "://" in argument or "::" in argument:
        return argument
    return str((source_directory / argument).resolve())


def _apply_preset(options: dict[str, Any], config: Config) -> dict[str, Any]:
    name = options["preset"]
    preset = config.reports.get(name)
    if preset is None:
        available = ", ".join(sorted(config.reports)) or "none"
        raise ValueError(f"unknown report preset {name!r}; available: {available}")
    merged = dict(options)
    if preset.benchmark is not None and "benchmark-filter" not in merged:
        merged["benchmark-filter"] = preset.benchmark
    if preset.metric is not None and "metric" not in merged:
        merged["metric"] = preset.metric
    if preset.view is not None and "view" not in merged:
        merged["view"] = preset.view
    if "selector" not in merged:
        if preset.latest_per_benchmark:
            merged["selector"] = "latest-per-benchmark"
        elif preset.latest is not None:
            merged["latest"] = preset.latest
    return merged


def _compile_source(argument: str, source_directory: Path, options: dict[str, Any], config: Config) -> Report:
    source_path = (source_directory / argument).resolve()
    if source_path.is_file() or source_path.suffix == ".json":
        return load_report(source_path)

    filters = RunFilters(statuses=("success",), benchmark=options.get("benchmark-filter"))
    stored_runs = apply_aliases(
        read_runs(_source_url(argument, source_directory)),
        benchmarks=config.aliases.benchmarks,
        parameters=config.aliases.parameters,
    )
    selectors = shlex.split(options.get("selector", ""))
    if selectors == ["latest-per-benchmark"]:
        runs = tuple(stored.run for stored in latest_measurements(stored_runs, filters))
    elif "latest-per-benchmark" in selectors:
        raise ValueError("latest-per-benchmark cannot be combined with other selectors")
    elif selectors:
        selected = [resolve_selector(stored_runs, selector, filters=filters).run for selector in selectors]
        runs = tuple({run.run_id: run for run in selected}.values())
    else:
        runs = tuple(stored.run for stored in filter_runs(stored_runs, filters))
        if latest := options.get("latest"):
            runs = runs[-latest:]
    return compile_report(runs, filters=filters)


def _note_source_dependencies(environment: BuildEnvironment, argument: str, source_directory: Path) -> None:
    if "://" in argument or "::" in argument:
        return
    source_path = (source_directory / argument).resolve()
    if source_path.is_file() or source_path.suffix == ".json":
        environment.note_dependency(str(source_path))
        return
    if not source_path.is_dir():
        return
    environment.note_reread()
    for pattern in ("*.json", "*.json.gz"):
        for dependency in source_path.rglob(pattern):
            if dependency.is_file() and not dependency.name.startswith("."):
                environment.note_dependency(str(dependency))


def _write_report(app: Sphinx, report: Report, source_name: str) -> str:
    payload = json.dumps(report.to_dict(), indent=2, ensure_ascii=True).encode() + b"\n"
    digest = hashlib.sha256(payload).hexdigest()[:12]
    stem = Path(source_name).stem or "report"
    filename = f"{stem}-{digest}.json"
    destination = Path(app.outdir) / "_static" / "benched" / "reports" / filename
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_bytes(payload)
    return f"_static/benched/reports/{filename}"


def _transform_report(app: Sphinx, report: Report, options: dict[str, Any]) -> Report:
    transformed = app.emit_firstresult("benched-process-report", report, dict(options))
    if transformed is None:
        return report
    if isinstance(transformed, Report):
        return Report.from_dict(transformed.to_dict())
    if isinstance(transformed, dict):
        return Report.from_dict(transformed)
    raise TypeError("benched-process-report must return benched.model.Report, a report dictionary, or None")


class BenchedDirective(Directive):
    required_arguments = 1
    final_argument_whitespace = True
    has_content = False
    option_spec = {  # noqa: RUF012
        "view": _choice(_VIEWS),
        "metric": _choice(_METRICS),
        "x-axis": _choice(_X_AXES),
        "benchmark": directives.unchanged_required,
        "benchmark-filter": directives.unchanged_required,
        "machine": directives.unchanged_required,
        "python": directives.unchanged_required,
        "memory": directives.unchanged_required,
        "selector": directives.unchanged_required,
        "preset": directives.unchanged_required,
        "hide-controls": _controls,
        "theme": _choice(_THEMES),
    }

    def run(self) -> list[nodes.Node]:
        environment = self.state.document.settings.env
        source_directory = Path(self.state.document.current_source).parent
        _note_source_dependencies(environment, self.arguments[0], source_directory)
        try:
            config = load_config(start=source_directory)
            options = dict(self.options)
            if "preset" in options:
                options = _apply_preset(options, config)
            report = _compile_source(self.arguments[0], source_directory, options, config)
            report = _transform_report(environment.app, report, options)
        except Exception as error:
            raise self.error(f"cannot prepare Benched report: {error}") from error
        node = BenchedReportNode()
        node["docname"] = environment.docname
        node["target"] = _write_report(environment.app, report, self.arguments[0])
        node["view"] = options.get("view", "overview")
        node["metric"] = options.get("metric", "median")
        node["x_axis"] = options.get("x-axis", "version")
        node["theme"] = options.get("theme", "inherit")
        if benchmark := options.get("benchmark"):
            node["benchmark"] = benchmark
        if hide_controls := options.get("hide-controls"):
            node["hide_controls"] = hide_controls
        for option in ("machine", "python", "memory"):
            if value := options.get(option):
                node[option] = value
        return [node]


def _visit_html(translator: Any, node: BenchedReportNode) -> None:
    page = translator.builder.get_target_uri(node["docname"])
    source = relative_uri(page, node["target"])
    attributes = {
        "src": source,
        "view": node["view"],
        "metric": node["metric"],
        "x-axis": node["x_axis"],
        "data-theme": node.get("theme", "inherit"),
    }
    if "benchmark" in node:
        attributes["benchmark"] = node["benchmark"]
    if "hide_controls" in node:
        attributes["hide-controls"] = node["hide_controls"]
    for option in ("machine", "python", "memory"):
        if option in node:
            attributes[option] = node[option]
    rendered = " ".join(f'{name}="{html.escape(value, quote=True)}"' for name, value in attributes.items())
    translator.body.append(f"<benched-report {rendered}></benched-report>")
    raise nodes.SkipNode


def _depart_html(translator: Any, node: BenchedReportNode) -> None:
    pass


def _copy_assets(app: Sphinx) -> None:
    source = resources.files("benched").joinpath("extension")
    destination = Path(app.outdir) / "_static" / "benched"
    destination.mkdir(parents=True, exist_ok=True)
    destination.joinpath("benched.js").write_bytes(source.joinpath("cdn/index.js").read_bytes())
    destination.joinpath("benched.css").write_bytes(source.joinpath("css/index.css").read_bytes())


def setup(app: Sphinx) -> dict[str, Any]:
    app.add_event("benched-process-report")
    app.add_node(BenchedReportNode, html=(_visit_html, _depart_html))
    app.add_directive("benched", BenchedDirective)
    app.add_css_file("benched/benched.css")
    app.add_js_file("benched/benched.js", type="module")
    app.connect("builder-inited", _copy_assets)
    return {
        "version": "0.1",
        "parallel_read_safe": False,
        "parallel_write_safe": True,
    }
