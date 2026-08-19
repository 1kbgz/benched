from __future__ import annotations

from collections.abc import Mapping
from typing import Any
from uuid import uuid4

import pytest

from . import __version__
from .model import EnvironmentInfo, Identity, MachineInfo, Measurement, Provenance, Run, ToolInfo
from .query import PEAK_MEMORY_SUFFIX, encode_benchmark_id


class IngestError(ValueError):
    """Raised when source benchmark data cannot be normalized."""


def _mapping(value: Any, field_name: str) -> Mapping[str, Any]:
    if not isinstance(value, Mapping):
        raise IngestError(f"{field_name} must be an object")
    return value


def _string(value: Any, field_name: str) -> str:
    if not isinstance(value, str) or not value:
        raise IngestError(f"{field_name} must be a non-empty string")
    return value


def _benchmark_id(nodeid: str, parameters: Mapping[str, Any]) -> str:
    base = nodeid.rsplit("[", 1)[0] if parameters and nodeid.endswith("]") else nodeid
    return encode_benchmark_id(base, parameters)


def normalize_pytest_benchmark(
    value: Any,
    *,
    started_at: str,
    ended_at: str,
    exit_code: int,
    suite: Identity,
    subject: Identity,
    machine: MachineInfo,
    environment: EnvironmentInfo,
    save_samples: bool = False,
    run_id: str | None = None,
) -> Run:
    data = _mapping(value, "pytest-benchmark document")
    source_version = _string(data.get("version"), "pytest-benchmark version")
    if source_version.split(".", 1)[0] != "5":
        raise IngestError(f"pytest-benchmark JSON version {source_version} is unsupported; expected version 5.x")
    raw_benchmarks = data.get("benchmarks")
    if not isinstance(raw_benchmarks, list):
        raise IngestError("pytest-benchmark benchmarks must be an array")

    measurements: list[Measurement] = []
    for index, raw_benchmark in enumerate(raw_benchmarks):
        benchmark = _mapping(raw_benchmark, f"benchmarks[{index}]")
        nodeid = _string(benchmark.get("fullname"), f"benchmarks[{index}].fullname")
        name = _string(benchmark.get("name"), f"benchmarks[{index}].name")
        parameters = dict(_mapping(benchmark.get("params") or {}, f"benchmarks[{index}].params"))
        raw_stats = dict(_mapping(benchmark.get("stats"), f"benchmarks[{index}].stats"))
        raw_samples = raw_stats.pop("data", None)
        if raw_samples is not None and (
            not isinstance(raw_samples, list) or not all(isinstance(item, (int, float)) and not isinstance(item, bool) for item in raw_samples)
        ):
            raise IngestError(f"benchmarks[{index}].stats.data must be an array of numbers")
        if not all(value is None or isinstance(value, (int, float, str)) and not isinstance(value, bool) for value in raw_stats.values()):
            raise IngestError(f"benchmarks[{index}].stats values must be scalar")

        group = benchmark.get("group")
        if group is not None and not isinstance(group, str):
            raise IngestError(f"benchmarks[{index}].group must be a string or null")
        parameter_id = benchmark.get("param")
        if parameter_id is not None and not isinstance(parameter_id, str):
            parameter_id = str(parameter_id)
        benchmark_id = _benchmark_id(nodeid, parameters)
        options = dict(_mapping(benchmark.get("options") or {}, f"benchmarks[{index}].options"))
        extra_info = dict(_mapping(benchmark.get("extra_info") or {}, f"benchmarks[{index}].extra_info"))
        peak_memory = extra_info.pop("peak_memory_bytes", None)
        timing = Measurement(
            benchmark_id=benchmark_id,
            nodeid=nodeid,
            name=name,
            group=group,
            parameter_id=parameter_id,
            parameters=parameters,
            options=options,
            extra_info=extra_info,
            stats=raw_stats,
            samples=tuple(float(item) for item in raw_samples) if save_samples and raw_samples is not None else None,
        )
        measurements.append(timing)
        if isinstance(peak_memory, (int, float)) and not isinstance(peak_memory, bool) and peak_memory >= 0:
            measurements.append(
                Measurement(
                    benchmark_id=f"{benchmark_id}{PEAK_MEMORY_SUFFIX}",
                    nodeid=nodeid,
                    name=f"{name} peak memory",
                    group=group,
                    parameter_id=parameter_id,
                    parameters=parameters,
                    unit="bytes",
                    options=options,
                    stats={"peak_memory": peak_memory},
                )
            )

    if exit_code == 0:
        status = "success"
    elif exit_code == int(pytest.ExitCode.INTERRUPTED):
        status = "interrupted"
    else:
        status = "failed"
    return Run(
        run_id=run_id or uuid4().hex,
        started_at=started_at,
        ended_at=ended_at,
        status=status,
        exit_code=exit_code,
        suite=suite,
        subject=subject,
        machine=machine,
        environment=environment,
        tool=ToolInfo(benched=__version__, pytest=pytest.__version__, pytest_benchmark=source_version),
        measurements=tuple(measurements),
        provenance=Provenance(source_format="pytest-benchmark"),
    )
