# Run benchmarks in prepared environments

This guide shows how to replace an ASV `--python=same` workflow with Benched in a
local environment, CI job, container, or Laxate-managed machine. Benched measures the
packages already installed in the active Python environment; it does not install or
switch versions.

## Configure benchmark and subject identity

Add Benched configuration to the benchmark suite's `pyproject.toml`. When the suite
benchmarks itself, the defaults inferred from `[project]` are sufficient:

```toml
[tool.benched]
benchmark_paths = ["benchmarks"]
results_dir = ".benched/results"
```

For a separate suite such as `csp-benchmarks`, name the installed code under test as
the subject:

```toml
[tool.benched]
benchmark_paths = ["csp_benchmarks/benchmarks"]
results_dir = "csp_benchmarks/results"

[tool.benched.suite]
name = "csp-benchmarks"
repository = "https://github.com/csp-community/csp-benchmarks"

[tool.benched.subject]
name = "csp"
distribution = "csp"
repository = "https://github.com/Point72/csp"
```

`distribution` lets Benched record the installed CSP version. Supply
`--subject-revision` as well when the environment contains a known CSP commit.

## Port benchmark functions to pytest

Replace ASV parameter and setup attributes with pytest parameterization and fixtures.
Keep setup outside the callable passed to `benchmark` so only the operation under test
is timed:

```python
import pytest


@pytest.fixture
def graph_times(num_ticks):
    start = make_start_time()
    return start, start + make_duration(num_ticks)


@pytest.mark.benchmark(group="core")
@pytest.mark.parametrize("num_nodes", [10, 100, 1_000])
@pytest.mark.parametrize("num_ticks", [100, 1_000, 10_000])
def test_linear_graph(benchmark, graph_times, num_nodes):
    graph = make_linear_graph(num_nodes)
    start, end = graph_times
    benchmark(run_graph, graph, start, end)
```

Use `benchmark.pedantic` when setup or teardown must happen before or after every
timed round. Do not retain a custom discovery, parameter-product, warmup, or timing
loop; pytest and pytest-benchmark provide those behaviors.

## Run locally or in CI

Install the desired subject and suite into one environment, then run Benched once:

```bash
python -m pip install "csp==2.10.0" "benched>=0.1.0"
benched run --machine github-actions
```

For a source checkout, record its revision explicitly:

```bash
benched run --machine github-actions --subject-revision "$CSP_COMMIT"
```

Use a CI matrix to choose Python or subject versions. Each matrix job installs its
version and invokes the same command; Benched records Python and installed subject
versions as separate collection axes.

## Run in Docker or Podman

Mount the benchmark repository so the configured results directory persists on the
host. Build or install dependencies before invoking Benched:

```bash
docker run --rm \
  --volume "$PWD:$PWD" \
  --workdir "$PWD" \
  python:3.12 \
  bash -lc 'pip install -e . && pip install benched && benched run --machine docker-3.12'
```

An fsspec URL can replace the mounted local results directory when its backend and
credentials are installed in the container.

## Invoke Benched through Laxate

Laxate's local, container, or remote runner only needs to execute Benched after it
prepares the environment. The command replacing `asv run --python=same` is:

```bash
benched run --machine "$MACHINE"
```

Keep environment creation, repository checkout, container lifecycle, SSH, and cloud
provisioning in Laxate. Point `[tool.benched].results_dir` at the directory Laxate
mounts, downloads, or commits. Laxate does not need an ASV machine file because
Benched collects machine, memory, and Python metadata directly.

## Publish the collected history

Generate static output after local or downloaded histories are available:

```bash
benched history
benched compare previous latest --fail-if median:10%
benched report --format html --output build/benchmarks
benched serve build/benchmarks --open
```

For CI publishing, upload the raw results directory as an artifact or commit it in a
separate deployment step. Benched itself does not push repositories or deploy pages.
