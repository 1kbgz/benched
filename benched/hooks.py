from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import pluggy

from .config import Config
from .model import Report, Run
from .query import RunFilters

hookspec = pluggy.HookspecMarker("benched")
hookimpl = pluggy.HookimplMarker("benched")


class PluginError(RuntimeError):
    """Raised when a named Benched plugin hook fails."""


@dataclass(slots=True)
class BenchmarkHookContext:
    config: Config
    pytest_args: list[str]
    environment: dict[str, str]
    raw_path: Path
    started_at: str
    ended_at: str | None = None
    exit_code: int | None = None
    run: Run | None = None
    error: BaseException | None = None


@dataclass(slots=True)
class RunHookContext:
    config: Config
    run: Run
    location: str | None = None


@dataclass(slots=True)
class ReportHookContext:
    config: Config
    filters: RunFilters
    runs: list[Run]
    report: Report | None = None
    artifacts: list[Path] = field(default_factory=list)


class HookSpecs:
    @hookspec
    def benched_before_benchmark(self, context: BenchmarkHookContext) -> None:
        """Prepare one benchmark subprocess and optionally adjust its arguments or environment."""

    @hookspec
    def benched_after_benchmark(self, context: BenchmarkHookContext) -> None:
        """Observe or clean up after one benchmark subprocess, including unsuccessful execution."""

    @hookspec
    def benched_enrich_run(self, context: RunHookContext) -> None:
        """Enrich or replace context.run before validation and persistence."""

    @hookspec
    def benched_after_store(self, context: RunHookContext) -> None:
        """Observe a successfully persisted run and its location."""

    @hookspec
    def benched_before_report(self, context: ReportHookContext) -> None:
        """Filter or annotate context.runs before report compilation."""

    @hookspec
    def benched_after_report(self, context: ReportHookContext) -> None:
        """Observe a compiled report and its generated artifacts."""


def create_plugin_manager(*, load_entrypoints: bool = True) -> pluggy.PluginManager:
    manager = pluggy.PluginManager("benched")
    manager.add_hookspecs(HookSpecs)
    if load_entrypoints:
        manager.load_setuptools_entrypoints("benched.plugins")
    return manager


def call_hook(manager: pluggy.PluginManager, hook_name: str, context: Any) -> None:
    caller = getattr(manager.hook, hook_name)
    implementations = sorted(caller.get_hookimpls(), key=lambda implementation: implementation.plugin_name)
    for implementation in implementations:
        try:
            implementation.function(context=context)
        except Exception as error:
            raise PluginError(f"plugin {implementation.plugin_name!r} failed during {hook_name}: {error}") from error
