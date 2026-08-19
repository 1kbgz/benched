# benched

Easy benchmarking

[![Build Status](https://github.com/1kbgz/benched/actions/workflows/build.yaml/badge.svg?branch=main&event=push)](https://github.com/1kbgz/benched/actions/workflows/build.yaml)
[![codecov](https://codecov.io/gh/1kbgz/benched/branch/main/graph/badge.svg)](https://codecov.io/gh/1kbgz/benched)
[![License](https://img.shields.io/github/license/1kbgz/benched)](https://github.com/1kbgz/benched)
[![PyPI](https://img.shields.io/pypi/v/benched.svg)](https://pypi.python.org/pypi/benched)

## Overview

Benched is being built as a current-environment benchmark runner with durable,
commit-aware history and embeddable reports. Pytest and pytest-benchmark own
collection, parameterization, fixtures, calibration, and statistics; Benched owns
identity, storage, comparison, and presentation.

See [How to run benchmarks in prepared environments](docs/how-to/run-in-prepared-environments.md)
for current-Python, CI, Docker, CSP, and Laxate migration patterns.

Current implementation runs ordinary pytest-benchmark tests in an isolated subprocess,
normalizes their JSON, and records immutable run documents. Benchmark-suite identity
stays separate from code-under-test identity.

```bash
benched run --quick
benched list
benched history
benched show RUN_ID
benched compare previous latest --fail-if median:10%
benched report --format terminal --format html --output build/benchmarks
benched serve build/benchmarks --port 0
```

Unknown `benched run` and `benched list` arguments are forwarded to pytest, including
paths, node IDs, `-k`, `-m`, and pytest-benchmark controls.

pytest-benchmark calibrates iterations and records multiple rounds by default (at
least five with its standard settings). `benched run --quick` changes the minimum to
one round and caps benchmark time at 0.05 seconds, so quick runs are not guaranteed to
contain multiple rounds. Saved statistics retain `rounds` and `iterations`.

```toml
[tool.benched]
benchmark_paths = ["benchmarks"]
results_dir = ".benched/results"

[tool.benched.subject]
name = "my-package"
distribution = "my-package"

[tool.benched.env]
MKL_NUM_THREADS = "1"
OMP_NUM_THREADS = "1"
OPENBLAS_NUM_THREADS = "1"
```

`results_dir` accepts any fsspec URL. Local files need no additional configuration;
remote protocols need their normal backend package and credentials. Backend options
can be supplied in `[tool.benched.storage_options]`, but environment- or profile-based
credentials are preferable to secrets in `pyproject.toml`.

`[tool.benched.env]` values override the parent environment for benchmark execution
and collection without modifying the parent process.

Report assets use Web Awesome for UI primitives and Lightweight Charts for plots. The
renderer-neutral report pipeline feeds terminal, JSON, HTML, and third-party
reporters.

## Local demo

Benched benchmarks its report compiler, history queries, and pytest-benchmark adapter
with ordinary parameterized pytest-benchmark tests in `benchmarks/`. After installing
development dependencies, use one current measurement as the structural seed for 30
days of deterministic synthetic history across five machines, three Python feature
versions, and several half-GiB memory buckets. Synthetic benchmark medians are
normalized to roughly two to four seconds before applying machine, Python, and
random-walk factors:

```bash
make demo-backfill
python -m benched serve build/demo --port 8000 --open
```

Synthetic runs are written only to `build/demo-results`, labeled `synthetic=true`,
and never mixed into normal benchmark history. The real seed is isolated in
`build/demo-seed-results`; both directories are recreated by the target. Use `make demo` instead for a two-point report containing only real measurements.

Or run each operation directly:

```bash
python -m benched list
python -m benched run --quick benchmarks
python -m benched run --quick benchmarks
python -m benched history
python -m benched report --latest 2 --format terminal --format html --output build/demo
python -m benched serve build/demo --port 8000 --open
```

Raw run documents are written beneath `.benched/results`; the generated site contains
`build/demo/index.html`, `data/report.json`, and packaged frontend assets. Both paths
are ignored by Git.

## Migration

`benched import-pytest` imports existing pytest-benchmark 5.x JSON files or
directories into canonical history. Imports retain source checksums, support dry-run
and fsspec destinations, and skip repeated content. See [How to import
pytest-benchmark history](docs/how-to/import-pytest-benchmark.md).

`benched import-asv` provides one-way, idempotent conversion of existing ASV v1 or v2
result directories without installing or executing ASV. See [How to migrate ASV
history to Benched](docs/how-to/migrate-from-asv.md) for same-project and separate
suite/subject examples.

Renamed benchmarks and imported histories with different identities can be joined
with a declarative alias map. Aliases map the unparameterized benchmark identity and
parameter names, and are applied when history is read for query, report, export, and
Sphinx embedding; stored run documents are never rewritten:

```toml
[tool.benched.aliases.benchmarks]
"solver.SolverSuite.time_solve" = "benchmarks/test_solver.py::test_solve"

[tool.benched.aliases.parameters]
problem_size = "n_assets"
```

## Query and compare

Run selectors accept an exact or unambiguous run-ID prefix, subject or suite revision,
subject version, branch, label value, `KEY=VALUE` label, `latest`, or `previous`.
`latest` and `previous` select only successful runs after filters are applied.

```bash
benched history --machine ci --python 3.12.13
benched show latest --benchmark "*test_parse*" --parameter size=100
benched compare previous latest --metric median
benched compare previous latest --fail-if median:10%
benched compare previous latest --fail-if peak_memory:10%
benched compare latest --baseline solver=mosek_qp
benched report --latest-per-benchmark --format html
benched export --format csv --output build/history.csv
benched compact --keep 20
```

`benched compare RUN --baseline KEY=VALUE` compares within one run instead of across
two. Measurements sharing every parameter except `KEY` are paired against the
measurement whose `KEY` equals `VALUE`, producing per-variant ratios grouped by the
remaining parameters.

`benched export` writes matching history as one CSV or Parquet row per measurement.
Parameters and statistics become columns; rows stay rectangular across benchmarks
with different parameter sets, with nulls where a column does not apply. Parquet
output requires `pyarrow` (`benched[export]`). The same table is available in Python
via `benched.export.tabulate`.

`benched compact --keep N` bounds history growth by consolidating all but the newest
`N` raw run documents into a gzip-compressed `archive.json.gz` beside them. Archived
runs keep full fidelity and remain visible to every query, report, and export.

Each `benched run` records the pytest subprocess's peak resident set size as a
`peak_memory` measurement in bytes. It is available to reports and `--metric`
without a benchmark-side sampling fixture. All benchmarks executed in one pytest
subprocess share that process peak; this measures resident memory, not allocations.

Available comparison metrics are `median`, `mean`, `min`, `max`, `ops`, and
`peak_memory`. Percentage and absolute gates fail only when regression exceeds
threshold; equality is allowed.
Comparison exit codes are `0` for success, `1` for gated regression, `2` for query or
usage errors, `3` for incompatible data, and `4` for an explicitly selected failed
benchmark run. `--allow-mismatch` permits deliberate machine or environment mismatch
while retaining warnings.

## Reports and extensions

`benched report` accepts the same run and measurement filters as history and compare.
Reports default to successful runs and terminal output. Repeat `--format` to combine
`terminal`, `json`, `html`, or installed third-party reporters. JSON and HTML output
is written beneath the local `--output` directory; raw history remains on its
configured fsspec backend.

Use `--latest-per-benchmark` to coalesce partial histories. For each matching
benchmark, the report keeps its measurement from the newest successful run while
retaining that run's metadata and provenance. This mode cannot be combined with
explicit run selectors or `--latest`.

Recurring report definitions can be named once in `pyproject.toml` and referenced
with `benched report --preset NAME` or the Sphinx `:preset:` option. A preset may
carry `benchmark`, `metric`, `view`, and either `latest` or `latest_per_benchmark`;
explicit command-line flags and directive options override preset values:

```toml
[tool.benched.reports.solver]
benchmark = "*test_solver*"
metric = "median"
view = "trend"
latest_per_benchmark = true
```

HTML output contains `index.html`, renderer-neutral report JSON, and packaged JS/CSS.
Preview it with `benched serve`, which binds to `127.0.0.1` and a dynamically selected
port by default. The preview server is read-only.

Reporter packages register objects implementing `benched.reporters.Reporter` in the
`benched.reporters` entry-point group. Lifecycle plugins register in
`benched.plugins` and implement hooks from `benched.hooks`:

- `benched_before_benchmark`
- `benched_after_benchmark`
- `benched_enrich_run`
- `benched_after_store`
- `benched_before_report`
- `benched_after_report`

Benchmark hooks wrap one complete pytest subprocess. The before hook may adjust final
pytest arguments or its environment; the after hook receives its exit code, optional
normalized run, raw JSON path, and error, and is attempted on unsuccessful execution.
Individual test setup and teardown remains ordinary pytest fixture behavior.

Hooks receive mutable context objects, execute once in lexical plugin-name order, and
may replace the pending run or filter report inputs. Canonical stored files are never
rewritten. Hook and reporter failures identify the responsible plugin and stop the
current command.

### Direct HTML embedding

Generated reports can be embedded without a Python runtime. Load the packaged assets
once, then point each component at report JSON. Components maintain independent view,
metric, benchmark, machine, Python, and x-axis filters.

```html
<link rel="stylesheet" href="assets/benched.css">
<script type="module" src="assets/benched.js"></script>
<benched-report
  src="data/report.json"
  view="trend"
  metric="median"
  x-axis="version"
  machine="linux,macos"
  python="3.11,3.12"
  memory="16,32"
  hide-controls="view,metric,x-axis,machine,python,memory"
  data-theme="inherit"
></benched-report>
```

Machine, Python, and Memory use ASV-style toggle panels so multiple series can remain
selected. Exact Python runtimes are grouped by feature version (`3.12.1` and `3.12.9`
become `3.12`); memory is collected from the machine and rounded to the nearest 0.5
GiB to avoid noisy VM metadata. Comma-separated `machine`, `python`, and `memory`
attributes can set initial selections.

Set `hide-controls` to a comma-separated combination of `view`, `metric`, `x-axis`,
`benchmark`, `machine`, `python`, `memory`, and `theme`. Hidden controls keep their
attribute selections active and can still be changed programmatically.

The component supports three consolidated views: `overview` combines summary counts
and a benchmark index, `trend` combines grouped charts and recent exact values, and
`comparison` shows previous/latest values by machine and Python context. Overview
benchmark links open their trend views. Trend charts use subject package version on
the x-axis by default; set `x-axis="time"` to use run time instead. Theme it through
inherited text and background colors and the `--benched-accent-color` and
`--benched-grid-color` CSS properties. `data-theme="inherit"` follows the surrounding
page and omits the component theme button. Otherwise, color mode follows the browser
preference until the report's theme button stores a local override. Set
`data-theme="light"` or `data-theme="dark"` for an explicit initial mode.

### Sphinx embedding

Install `benched[sphinx]`, add `benched.sphinx` to `extensions`, and reference either
a prepared report JSON file or an existing results directory. Documentation builds
never execute benchmarks.

```python
# conf.py
extensions = ["benched.sphinx"]
```

```rst
.. benched:: ../benchmarks/report.json
   :view: trend
   :benchmark: tests/benchmarks/test_parse.py::test_parse
   :metric: median
   :x-axis: version
   :python: 3.11,3.12
   :memory: 16,32
   :hide-controls: view,metric,x-axis,benchmark,machine,python,memory
```

For a results directory, omit `:selector:` to include all successful runs or provide
space-separated selectors such as `:selector: previous latest`. Use
`:benchmark-filter: *test_parse*` to limit the benchmarks compiled from stored runs.
`:benchmark:` takes one exact benchmark ID and preselects it in the embedded component;
it does not filter report compilation. JSON and packaged assets are copied beneath
Sphinx's `_static/benched` output with page-relative URLs. Local report files and
results directories are rebuilt when their contents change.
Sphinx embeds use `theme="inherit"` by default; set `:theme: light` or `:theme: dark`
to override the surrounding page.
The `benched-process-report` event can return a validated replacement report before
that JSON is written. See [How to customize a Benched report in
Sphinx](docs/how-to/customize-sphinx-report.md).

MyST uses the same directive:

````markdown
```{benched} ../benchmarks/report.json
:view: comparison
:metric: mean
```
````

> [!NOTE]
> This library was generated using [copier](https://copier.readthedocs.io/en/stable/) from the [Base Python Project Template repository](https://github.com/python-project-templates/base).
