from __future__ import annotations

import argparse
import json
import sys
from collections.abc import Sequence
from dataclasses import replace
from pathlib import Path

from .asv import AsvImportError, import_asv_results, infer_asv_identities
from .compare import (
    SUPPORTED_METRICS,
    BenchmarkRunError,
    CompareError,
    CompatibilityError,
    RunComparison,
    ThresholdError,
    ThresholdEvaluationError,
    compare_runs,
    parse_threshold,
    regression_gate,
)
from .config import ConfigError, load_config
from .hooks import PluginError
from .pytest_import import PytestImportError, PytestImportOptions, import_pytest_benchmarks
from .query import QueryError, RunFilters, filter_measurements, filter_runs, resolve_selector
from .report import ReportError, generate_report
from .reporters import ReporterError
from .runner import RunnerError, collect_benchmarks, run_benchmarks
from .serve import ServeError, serve
from .storage import StorageError, read_runs

EXIT_REGRESSION = 1
EXIT_USAGE = 2
EXIT_INCOMPATIBLE = 3
EXIT_BENCHMARK_FAILED = 4


def _parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="benched", description="Run and inspect durable pytest benchmarks")
    parser.add_argument("command", choices=("run", "list", "history", "show", "compare", "report", "serve", "import-asv", "import-pytest"))
    return parser


def _config_parser(prog: str) -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog=prog)
    parser.add_argument("--pyproject")
    parser.add_argument("--results-dir", help="local path or fsspec URL")
    return parser


def _config(arguments: argparse.Namespace):
    overrides = {"results_dir": arguments.results_dir} if arguments.results_dir else None
    return load_config(arguments.pyproject, overrides=overrides)


def _labels(values: Sequence[str]) -> dict[str, str]:
    labels: dict[str, str] = {}
    for value in values:
        key, separator, item = value.partition("=")
        if not separator or not key:
            raise ConfigError(f"label must use KEY=VALUE: {value!r}")
        labels[key] = item
    return labels


def _add_filters(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--subject")
    parser.add_argument("--machine")
    parser.add_argument("--python")
    parser.add_argument("--status", action="append", choices=("success", "failed", "interrupted"), default=[])
    parser.add_argument("--benchmark", help="benchmark ID, node ID, or name glob")
    parser.add_argument("--group")
    parser.add_argument("--parameter", action="append", default=[], metavar="KEY=VALUE")


def _parameter_filters(values: Sequence[str]) -> dict[str, object]:
    parameters: dict[str, object] = {}
    for value in values:
        key, separator, raw_item = value.partition("=")
        if not separator or not key:
            raise QueryError(f"parameter must use KEY=VALUE: {value!r}")
        try:
            item = json.loads(raw_item)
        except json.JSONDecodeError:
            item = raw_item
        parameters[key] = item
    return parameters


def _filters(options: argparse.Namespace) -> RunFilters:
    return RunFilters(
        subject=options.subject,
        machine=options.machine,
        python=options.python,
        statuses=tuple(options.status),
        benchmark=options.benchmark,
        group=options.group,
        parameters=_parameter_filters(options.parameter),
    )


def _pytest_args(arguments: list[str]) -> tuple[str, ...]:
    if arguments and arguments[0] == "--":
        arguments = arguments[1:]
    return tuple(arguments)


def _run(arguments: list[str]) -> int:
    parser = _config_parser("benched run")
    parser.add_argument("--quick", action="store_true")
    parser.add_argument("--save-samples", action="store_true")
    parser.add_argument("--no-save", action="store_true")
    parser.add_argument("--mixed", action="store_true", help="run ordinary tests alongside benchmarks")
    parser.add_argument("--suite-revision")
    parser.add_argument("--subject-version")
    parser.add_argument("--subject-revision")
    parser.add_argument("--subject-label", action="append", default=[])
    parser.add_argument("--machine")
    options, remaining = parser.parse_known_args(arguments)
    result = run_benchmarks(
        _config(options),
        _pytest_args(remaining),
        quick=options.quick,
        save_samples=options.save_samples,
        no_save=options.no_save,
        mixed=options.mixed,
        suite_revision=options.suite_revision,
        subject_version=options.subject_version,
        subject_revision=options.subject_revision,
        subject_labels=_labels(options.subject_label),
        machine_id=options.machine,
    )
    if result.run is None:
        print("benched: pytest produced no usable benchmark data", file=sys.stderr)
        return result.exit_code or 2
    destination = result.location or "not saved"
    print(f"{result.run.run_id} {result.run.status} {len(result.run.measurements)} measurements {destination}")
    return result.exit_code


def _list(arguments: list[str]) -> int:
    parser = _config_parser("benched list")
    options, remaining = parser.parse_known_args(arguments)
    exit_code, nodeids = collect_benchmarks(_config(options), _pytest_args(remaining))
    for nodeid in nodeids:
        print(nodeid)
    return exit_code


def _history(arguments: list[str]) -> int:
    parser = _config_parser("benched history")
    parser.add_argument("selectors", nargs="*")
    _add_filters(parser)
    options = parser.parse_args(arguments)
    config = _config(options)
    all_runs = read_runs(config.results_dir, storage_options=config.storage_options)
    filters = _filters(options)
    if options.selectors:
        selected = [resolve_selector(all_runs, selector, filters=filters) for selector in options.selectors]
        stored_runs = tuple({stored.run.run_id: stored for stored in selected}.values())
    else:
        stored_runs = filter_runs(all_runs, filters)
    for stored in stored_runs:
        run = stored.run
        subject = run.subject.revision or run.subject.version or "unknown"
        measurement_count = len(filter_measurements(run, filters))
        print(f"{run.run_id}  {run.ended_at}  {run.status:<11}  {run.machine.id}  {run.subject.name}@{subject}  {measurement_count}")
    return 0


def _show(arguments: list[str]) -> int:
    parser = _config_parser("benched show")
    parser.add_argument("run")
    _add_filters(parser)
    options = parser.parse_args(arguments)
    config = _config(options)
    filters = _filters(options)
    stored = resolve_selector(read_runs(config.results_dir, storage_options=config.storage_options), options.run, filters=filters)
    run = replace(stored.run, measurements=filter_measurements(stored.run, filters))
    print(json.dumps(run.to_dict(), indent=2, ensure_ascii=True))
    return 0


def _display_number(value: float | None) -> str:
    return "-" if value is None else f"{value:.6g}"


def _print_comparison(comparison: RunComparison) -> None:
    print(f"base {comparison.base_run_id}  head {comparison.head_run_id}  metric {comparison.metric}")
    print(f"{'status':<13} {'base':>12} {'head':>12} {'delta':>12} {'change':>10}  benchmark")
    for difference in comparison.differences:
        percent = "-" if difference.percent is None else f"{difference.percent:+.2f}%"
        detail = f" ({difference.reason})" if difference.reason else ""
        print(
            f"{difference.status:<13} {_display_number(difference.base):>12} {_display_number(difference.head):>12} "
            f"{_display_number(difference.delta):>12} {percent:>10}  {difference.benchmark_id}{detail}"
        )
    for warning in comparison.warnings:
        print(f"warning: {warning}", file=sys.stderr)


def _compare(arguments: list[str]) -> int:
    parser = _config_parser("benched compare")
    parser.add_argument("base")
    parser.add_argument("head")
    parser.add_argument("--metric", choices=SUPPORTED_METRICS)
    parser.add_argument("--fail-if", metavar="[METRIC:]THRESHOLD[%]")
    parser.add_argument("--allow-mismatch", action="store_true")
    _add_filters(parser)
    options = parser.parse_args(arguments)
    config = _config(options)
    filters = _filters(options)
    stored_runs = read_runs(config.results_dir, storage_options=config.storage_options)
    selector_filters = replace(filters, benchmark=None, group=None, parameters={})
    base = resolve_selector(stored_runs, options.base, filters=selector_filters).run
    head = resolve_selector(stored_runs, options.head, filters=selector_filters).run

    threshold = parse_threshold(options.fail_if, default_metric=options.metric or "median") if options.fail_if else None
    if options.metric is not None and threshold is not None and options.metric != threshold.metric:
        raise ThresholdError(f"--metric {options.metric!r} conflicts with threshold metric {threshold.metric!r}")
    metric = options.metric or (threshold.metric if threshold is not None else "median")
    comparison = compare_runs(base, head, metric=metric, filters=filters, allow_mismatch=options.allow_mismatch)
    _print_comparison(comparison)
    if any(difference.status == "incompatible" for difference in comparison.differences):
        return EXIT_INCOMPATIBLE
    if threshold is not None and regression_gate(comparison, threshold):
        return EXIT_REGRESSION
    return 0


def _report(arguments: list[str]) -> int:
    parser = _config_parser("benched report")
    parser.add_argument("selectors", nargs="*")
    parser.add_argument("--format", action="append", default=[], dest="formats")
    parser.add_argument("--output", default="build/benched")
    parser.add_argument("--metric", choices=SUPPORTED_METRICS, default="median")
    parser.add_argument("--latest", type=int, metavar="N")
    _add_filters(parser)
    options = parser.parse_args(arguments)
    if options.latest is not None and options.latest < 1:
        raise ReportError("--latest must be at least 1")
    if options.latest is not None and options.selectors:
        raise ReportError("--latest cannot be combined with explicit selectors")
    config = _config(options)
    filters = _filters(options)
    if not filters.statuses:
        filters = replace(filters, statuses=("success",))
    stored_runs = read_runs(config.results_dir, storage_options=config.storage_options)
    if options.selectors:
        selected = [resolve_selector(stored_runs, selector, filters=filters) for selector in options.selectors]
        selected_runs = list({stored.run.run_id: stored.run for stored in selected}.values())
    else:
        selected_runs = [stored.run for stored in filter_runs(stored_runs, filters)]
    if options.latest is not None:
        selected_runs = selected_runs[-options.latest :]
    output = Path(options.output)
    if not output.is_absolute():
        output = config.project_root / output
    _, artifacts = generate_report(
        config,
        selected_runs,
        filters=filters,
        reporter_names=tuple(options.formats or ("terminal",)),
        output=output,
        metric=options.metric,
        stream=sys.stdout,
    )
    for artifact in artifacts:
        print(f"wrote {artifact.kind} {artifact.path}")
    return 0


def _serve(arguments: list[str]) -> int:
    parser = argparse.ArgumentParser(prog="benched serve")
    parser.add_argument("path")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=0)
    parser.add_argument("--open", action="store_true", dest="open_browser")
    options = parser.parse_args(arguments)
    serve(options.path, host=options.host, port=options.port, open_browser=options.open_browser)
    return 0


def _import_asv(arguments: list[str]) -> int:
    parser = _config_parser("benched import-asv")
    parser.add_argument("source", help="ASV results directory")
    parser.add_argument("--asv-config")
    parser.add_argument("--suite-name")
    parser.add_argument("--suite-repository")
    parser.add_argument("--subject-name")
    parser.add_argument("--subject-repository")
    parser.add_argument("--subject-version")
    parser.add_argument("--subject-version-param")
    parser.add_argument("--dry-run", action="store_true")
    options = parser.parse_args(arguments)
    config = _config(options)
    identities = infer_asv_identities(
        options.source,
        asv_config=options.asv_config,
        suite_name=options.suite_name,
        suite_repository=options.suite_repository,
        subject_name=options.subject_name,
        subject_repository=options.subject_repository,
        subject_version=options.subject_version,
        subject_version_param=options.subject_version_param,
    )
    summary = import_asv_results(
        options.source,
        config.results_dir,
        identities,
        storage_options=config.storage_options,
        dry_run=options.dry_run,
    )
    action = "would import" if options.dry_run else "imported"
    print(
        f"{action} {summary.imported if not options.dry_run else summary.converted - summary.skipped} runs; "
        f"skipped {summary.skipped}; ignored {summary.ignored}"
    )
    for location in summary.locations:
        print(f"wrote {location}")
    for warning in summary.warnings:
        print(f"warning: {warning}", file=sys.stderr)
    return 0


def _import_pytest(arguments: list[str]) -> int:
    parser = _config_parser("benched import-pytest")
    parser.add_argument("source", nargs="+", help="pytest-benchmark JSON file or directory")
    parser.add_argument("--suite-name")
    parser.add_argument("--suite-repository")
    parser.add_argument("--subject-name")
    parser.add_argument("--subject-repository")
    parser.add_argument("--subject-version")
    parser.add_argument("--subject-revision")
    parser.add_argument("--machine")
    parser.add_argument("--save-samples", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    options = parser.parse_args(arguments)
    config = _config(options)
    identities = PytestImportOptions(
        suite_name=options.suite_name or config.suite.name,
        suite_repository=options.suite_repository or config.suite.repository,
        subject_name=options.subject_name or config.subject.name,
        subject_repository=options.subject_repository or config.subject.repository,
        subject_version=options.subject_version,
        subject_revision=options.subject_revision,
        machine_id=options.machine,
    )
    summary = import_pytest_benchmarks(
        tuple(options.source),
        config.results_dir,
        identities,
        storage_options=config.storage_options,
        save_samples=options.save_samples,
        dry_run=options.dry_run,
    )
    action = "would import" if options.dry_run else "imported"
    count = summary.converted - summary.skipped if options.dry_run else summary.imported
    print(f"{action} {count} runs; skipped {summary.skipped}")
    for location in summary.locations:
        print(f"wrote {location}")
    return 0


def main(argv: Sequence[str] | None = None) -> int:
    arguments = list(argv if argv is not None else sys.argv[1:])
    try:
        parsed = _parser().parse_args(arguments[:1])
        remaining = arguments[1:]
        commands = {
            "run": _run,
            "list": _list,
            "history": _history,
            "show": _show,
            "compare": _compare,
            "report": _report,
            "serve": _serve,
            "import-asv": _import_asv,
            "import-pytest": _import_pytest,
        }
        return commands[parsed.command](remaining)
    except BenchmarkRunError as error:
        print(f"benched: {error}", file=sys.stderr)
        return EXIT_BENCHMARK_FAILED
    except (CompatibilityError, ThresholdEvaluationError) as error:
        print(f"benched: {error}", file=sys.stderr)
        return EXIT_INCOMPATIBLE
    except (
        AsvImportError,
        CompareError,
        ConfigError,
        PluginError,
        PytestImportError,
        QueryError,
        ReportError,
        ReporterError,
        RunnerError,
        ServeError,
        StorageError,
    ) as error:
        print(f"benched: {error}", file=sys.stderr)
        return EXIT_USAGE
