from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile
import threading
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

import pluggy
import psutil

from .config import Config
from .hooks import BenchmarkHookContext, PluginError, RunHookContext, call_hook, create_plugin_manager
from .identity import resolve_environment, resolve_identities, resolve_machine
from .ingest import IngestError, normalize_pytest_benchmark
from .model import Run
from .storage import save_run


class RunnerError(RuntimeError):
    """Raised when pytest does not produce usable benchmark data."""


@dataclass(frozen=True, slots=True)
class RunResult:
    exit_code: int
    run: Run | None
    location: str | None


def _now() -> str:
    return datetime.now(UTC).isoformat()


def _has_target(arguments: tuple[str, ...], project_root: Path) -> bool:
    for argument in arguments:
        if argument.startswith("-"):
            continue
        candidate = argument.split("::", 1)[0]
        if "::" in argument or candidate.endswith(".py") or (project_root / candidate).exists():
            return True
    return False


def _pytest_arguments(config: Config, arguments: tuple[str, ...]) -> list[str]:
    result = [sys.executable, "-m", "pytest", "-p", "benched.pytest_plugin", f"--rootdir={config.project_root}"]
    if not _has_target(arguments, config.project_root):
        result.extend(str(path) for path in config.benchmark_paths)
    result.extend(arguments)
    return result


def _subprocess_environment(config: Config) -> dict[str, str]:
    environment = dict(os.environ)
    environment.update(config.env)
    return environment


def _run_with_peak_memory(arguments: list[str], *, cwd: Path, env: dict[str, str]) -> tuple[int, int]:
    parent = psutil.Process()
    peak = 0
    stop = threading.Event()

    def sample() -> None:
        nonlocal peak
        while not stop.wait(0.001):
            try:
                samples = [child.memory_info().rss for child in parent.children(recursive=True)]
                if samples:
                    peak = max(peak, *samples)
            except psutil.NoSuchProcess:
                continue

    sampler = threading.Thread(target=sample, daemon=True)
    sampler.start()
    try:
        exit_code = subprocess.run(arguments, cwd=cwd, env=env, check=False).returncode
    finally:
        stop.set()
        sampler.join()
    return exit_code, peak


def run_benchmarks(
    config: Config,
    pytest_args: tuple[str, ...] = (),
    *,
    quick: bool = False,
    save_samples: bool = False,
    no_save: bool = False,
    mixed: bool = False,
    suite_revision: str | None = None,
    subject_version: str | None = None,
    subject_revision: str | None = None,
    subject_labels: dict[str, str] | None = None,
    machine_id: str | None = None,
    plugin_manager: pluggy.PluginManager | None = None,
) -> RunResult:
    manager = plugin_manager or create_plugin_manager()
    suite, subject = resolve_identities(
        config,
        suite_revision=suite_revision,
        subject_version=subject_version,
        subject_revision=subject_revision,
        subject_labels=subject_labels,
    )
    machine = resolve_machine(machine_id)
    environment = resolve_environment()
    started_at = _now()
    with tempfile.TemporaryDirectory(prefix="benched-") as temporary_directory:
        raw_path = Path(temporary_directory) / "pytest-benchmark.json"
        arguments = _pytest_arguments(config, pytest_args)
        arguments.append(f"--benchmark-json={raw_path}")
        if not mixed:
            arguments.append("--benchmark-only")
        if quick:
            arguments.extend(["--benchmark-min-rounds=1", "--benchmark-max-time=0.05"])
        benchmark_context = BenchmarkHookContext(
            config=config,
            pytest_args=arguments,
            environment=_subprocess_environment(config),
            raw_path=raw_path,
            started_at=started_at,
        )
        try:
            call_hook(manager, "benched_before_benchmark", benchmark_context)
            benchmark_context.exit_code, peak_memory = _run_with_peak_memory(
                benchmark_context.pytest_args,
                cwd=config.project_root,
                env=benchmark_context.environment,
            )
            benchmark_context.ended_at = _now()
            if not raw_path.is_file() or raw_path.stat().st_size == 0:
                run = None
            else:
                raw_data: Any = json.loads(raw_path.read_text(encoding="utf-8"))
                for benchmark in raw_data.get("benchmarks", ()):
                    benchmark.setdefault("extra_info", {})["peak_memory_bytes"] = peak_memory
                run = normalize_pytest_benchmark(
                    raw_data,
                    started_at=started_at,
                    ended_at=benchmark_context.ended_at,
                    exit_code=benchmark_context.exit_code,
                    suite=suite,
                    subject=subject,
                    machine=machine,
                    environment=environment,
                    save_samples=save_samples,
                )
            benchmark_context.run = run
        except (OSError, json.JSONDecodeError, IngestError) as error:
            wrapped = RunnerError(f"pytest produced invalid benchmark data: {error}")
            benchmark_context.error = wrapped
            try:
                call_hook(manager, "benched_after_benchmark", benchmark_context)
            except PluginError as hook_error:
                wrapped.add_note(str(hook_error))
            raise wrapped from error
        except BaseException as error:
            benchmark_context.error = error
            try:
                call_hook(manager, "benched_after_benchmark", benchmark_context)
            except PluginError as hook_error:
                error.add_note(str(hook_error))
            raise
        else:
            call_hook(manager, "benched_after_benchmark", benchmark_context)
            run = benchmark_context.run

    exit_code = benchmark_context.exit_code
    if exit_code is None:
        raise RunnerError("benchmark subprocess did not start")
    if run is None:
        return RunResult(exit_code=exit_code, run=None, location=None)
    context = RunHookContext(config=config, run=run)
    call_hook(manager, "benched_enrich_run", context)
    run = Run.from_dict(context.run.to_dict())
    location = None if no_save else save_run(config.results_dir, run, storage_options=config.storage_options)
    if location is not None:
        context.run = run
        context.location = location
        call_hook(manager, "benched_after_store", context)
    return RunResult(exit_code=exit_code, run=run, location=location)


def collect_benchmarks(config: Config, pytest_args: tuple[str, ...] = ()) -> tuple[int, tuple[str, ...]]:
    with tempfile.TemporaryDirectory(prefix="benched-collect-") as temporary_directory:
        output_path = Path(temporary_directory) / "nodeids.json"
        arguments = _pytest_arguments(config, pytest_args)
        arguments.extend(["--collect-only", "-qq"])
        environment = _subprocess_environment(config)
        environment["BENCHED_COLLECTION_PATH"] = str(output_path)
        completed = subprocess.run(arguments, cwd=config.project_root, env=environment, check=False, capture_output=True, text=True)
        exit_code = completed.returncode
        if exit_code:
            sys.stdout.write(completed.stdout)
            sys.stderr.write(completed.stderr)
        nodeids = tuple(json.loads(output_path.read_text(encoding="utf-8"))) if output_path.is_file() else ()
    return exit_code, nodeids
