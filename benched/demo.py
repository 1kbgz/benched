from __future__ import annotations

import argparse
import hashlib
import math
import random
from dataclasses import replace
from datetime import datetime, timedelta

from .model import Measurement, Provenance
from .storage import read_runs, save_run

TIME_STATS = {
    "min",
    "max",
    "mean",
    "stddev",
    "median",
    "iqr",
    "q1",
    "q3",
    "ld15iqr",
    "hd15iqr",
    "total",
}

DEMO_MACHINES = (
    ("demo-linux-x86", "Linux", "x86_64", 16.0, 1.18),
    ("demo-linux-arm", "Linux", "arm64", 8.0, 0.88),
    ("demo-macos-arm", "Darwin", "arm64", 32.0, 0.78),
    ("demo-windows-x86", "Windows", "AMD64", 24.0, 1.32),
)


def _scale_measurement(measurement: Measurement, factor: float) -> Measurement:
    stats = dict(measurement.stats)
    for name in TIME_STATS:
        value = stats.get(name)
        if isinstance(value, (int, float)) and not isinstance(value, bool):
            stats[name] = value * factor
    ops = stats.get("ops")
    if isinstance(ops, (int, float)) and not isinstance(ops, bool):
        stats["ops"] = ops / factor
    samples = tuple(value * factor for value in measurement.samples) if measurement.samples is not None else None
    return replace(measurement, stats=stats, samples=samples)


def _python_versions(current: str) -> tuple[tuple[str, float], ...]:
    major, minor, *_ = (int(part) for part in current.split("."))
    return (
        (f"{major}.{max(0, minor - 1)}.0", 1.06),
        (current, 1.0),
        (f"{major}.{minor + 1}.0", 0.94),
    )


def _demo_measurements(measurements: tuple[Measurement, ...]) -> tuple[Measurement, ...]:
    normalized = []
    for measurement in measurements:
        median = measurement.stats.get("median")
        if not isinstance(median, (int, float)) or isinstance(median, bool) or median <= 0:
            normalized.append(measurement)
            continue
        digest = int(hashlib.sha256(measurement.benchmark_id.encode()).hexdigest()[:8], 16)
        target = 2.0 + (digest % 2000) / 1000
        normalized.append(_scale_measurement(measurement, target / median))
    return tuple(normalized)


def backfill_demo(results_dir: str, *, output_dir: str | None = None, count: int = 30, seed: int = 2026) -> tuple[str, ...]:
    if count < 1:
        raise ValueError("count must be at least 1")
    stored = read_runs(results_dir)
    if not stored:
        raise ValueError("demo backfill needs one current benchmark run")
    measured = [item.run for item in stored if item.run.provenance.source_format != "benched-demo"]
    if not measured:
        raise ValueError("demo backfill needs one current benchmark run")
    current = max(measured, key=lambda run: (datetime.fromisoformat(run.ended_at), run.run_id))
    measurements = _demo_measurements(current.measurements)
    started_at = datetime.fromisoformat(current.started_at)
    ended_at = datetime.fromisoformat(current.ended_at)
    current_memory = current.machine.metadata.get("memory_gib", 32.0)
    machines = ((current.machine.id, current.environment.platform, current.environment.architecture, current_memory, 1.0), *DEMO_MACHINES)
    python_versions = _python_versions(current.environment.python_version)
    factors = {
        (machine_id, python_version, measurement.benchmark_id): machine_scale * python_scale
        for machine_id, _, _, _, machine_scale in machines
        for python_version, python_scale in python_versions
        for measurement in measurements
    }
    generators = {key: random.Random(f"{seed}:{key[0]}:{key[1]}:{key[2]}") for key in factors}
    locations: list[str] = []
    for index in range(count + 1):
        if index > 0:
            for key, generator in generators.items():
                factors[key] *= math.exp(generator.gauss(0, 0.025))
        historical_started = started_at - timedelta(days=index)
        historical_ended = ended_at - timedelta(days=index)
        revision = f"demo-{historical_started:%Y%m%d}"
        subject_version = current.subject.version or "0"
        if index > 0:
            subject_version = f"{subject_version}.dev{count - index + 1}"
        labels = {**current.subject.labels, "synthetic": "true"}
        for machine_id, platform, architecture, memory_gib, _ in machines:
            for python_version, _ in python_versions:
                if output_dir is None and index == 0 and machine_id == current.machine.id and python_version == current.environment.python_version:
                    continue
                digest = hashlib.sha256(f"{current.run_id}:{seed}:{machine_id}:{python_version}:{index}".encode()).hexdigest()[:20]
                machine_fingerprint = hashlib.sha256(f"benched-demo-machine:{machine_id}".encode()).hexdigest()
                environment_fingerprint = hashlib.sha256(f"benched-demo-environment:{machine_id}:{python_version}".encode()).hexdigest()
                synthetic_machine = machine_id != current.machine.id
                machine = (
                    replace(
                        current.machine,
                        id=machine_id,
                        fingerprint=machine_fingerprint,
                        metadata={
                            "system": platform,
                            "architecture": architecture,
                            "memory_gib": memory_gib,
                            "synthetic": True,
                        },
                        labels={**current.machine.labels, "synthetic": "true"},
                    )
                    if synthetic_machine
                    else current.machine
                )
                synthetic_environment = synthetic_machine or python_version != current.environment.python_version
                environment = (
                    replace(
                        current.environment,
                        fingerprint=environment_fingerprint,
                        python_version=python_version,
                        platform=platform,
                        architecture=architecture,
                        labels={**current.environment.labels, "synthetic": "true"},
                    )
                    if synthetic_environment
                    else current.environment
                )
                run = replace(
                    current,
                    run_id=f"demo-{digest}",
                    started_at=historical_started.isoformat(),
                    ended_at=historical_ended.isoformat(),
                    suite=replace(current.suite, labels={**current.suite.labels, "synthetic": "true"}),
                    subject=replace(current.subject, version=subject_version, revision=revision, labels=labels),
                    machine=machine,
                    environment=environment,
                    measurements=tuple(
                        _scale_measurement(measurement, factors[(machine_id, python_version, measurement.benchmark_id)])
                        for measurement in measurements
                    ),
                    provenance=Provenance(
                        source_format="benched-demo",
                        source_file=current.run_id,
                        warnings=("Synthetic history generated for the Benched demo.",),
                    ),
                )
                locations.append(save_run(output_dir or results_dir, run))
    return tuple(locations)


def main() -> None:
    parser = argparse.ArgumentParser(description="Backfill synthetic history for the Benched demo")
    parser.add_argument("--results-dir", required=True)
    parser.add_argument("--output-dir")
    parser.add_argument("--count", type=int, default=30)
    parser.add_argument("--seed", type=int, default=2026)
    options = parser.parse_args()
    locations = backfill_demo(options.results_dir, output_dir=options.output_dir, count=options.count, seed=options.seed)
    print(f"backfilled {len(locations)} synthetic runs in {options.output_dir or options.results_dir}")


if __name__ == "__main__":
    main()
