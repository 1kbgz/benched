from dataclasses import replace
from pathlib import Path

import pytest

from benched.config import load_config
from benched.hooks import PluginError, ReportHookContext, RunHookContext, call_hook, create_plugin_manager, hookimpl
from benched.model import load_run
from benched.query import RunFilters

FIXTURES = Path(__file__).with_name("fixtures")


def _config(tmp_path):
    return load_config(start=tmp_path, environ={})


def test_hooks_run_once_in_plugin_name_order(tmp_path):
    calls = []

    class Plugin:
        def __init__(self, name):
            self.name = name

        @hookimpl
        def benched_enrich_run(self, context):
            calls.append(self.name)

    manager = create_plugin_manager(load_entrypoints=False)
    manager.register(Plugin("z"), name="z-plugin")
    manager.register(Plugin("a"), name="a-plugin")
    context = RunHookContext(config=_config(tmp_path), run=load_run(FIXTURES / "canonical-run-v1.json"))

    call_hook(manager, "benched_enrich_run", context)

    assert calls == ["a", "z"]


def test_enrich_hook_can_replace_run_before_validation(tmp_path):
    class Plugin:
        @hookimpl
        def benched_enrich_run(self, context):
            context.run = replace(context.run, subject=replace(context.run.subject, labels={"build": "optimized"}))

    manager = create_plugin_manager(load_entrypoints=False)
    manager.register(Plugin(), name="metadata")
    context = RunHookContext(config=_config(tmp_path), run=load_run(FIXTURES / "canonical-run-v1.json"))

    call_hook(manager, "benched_enrich_run", context)

    assert context.run.subject.labels == {"build": "optimized"}


def test_failing_hook_names_plugin(tmp_path):
    class Plugin:
        @hookimpl
        def benched_before_report(self, context):
            raise RuntimeError("broken")

    manager = create_plugin_manager(load_entrypoints=False)
    manager.register(Plugin(), name="broken-plugin")
    run = load_run(FIXTURES / "canonical-run-v1.json")
    context = ReportHookContext(config=_config(tmp_path), filters=RunFilters(), runs=[run])

    with pytest.raises(PluginError, match="'broken-plugin'.*benched_before_report.*broken"):
        call_hook(manager, "benched_before_report", context)
