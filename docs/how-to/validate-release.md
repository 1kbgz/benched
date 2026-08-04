# How to validate a Benched release

This guide shows you how to run Benched's source, browser, documentation, and
installed-distribution checks before publishing a release.

## Run source checks

Install development dependencies, then run linting, types, Python tests, and browser
tests:

```bash
make develop
make lint
make check-types
make test
```

`make test` exercises the Python API and CLI, Benched's Sphinx extension, and the Web
Component in Chromium. The browser suite generates a 100-version, five-machine,
three-Python report in memory and records its load and render timings.

## Measure report scaling

Run Benched's pytest-benchmark suite without saving its measurements:

```bash
benched run --quick --no-save benchmarks/test_benched.py \
  -k "compile_report or serialize_report"
```

The generated fixture contains 100 revisions and 1,000 parameterized benchmark
cases. Use normal benchmark settings instead of `--quick` when collecting a baseline
for performance comparisons.

## Build the project documentation

Build Benched's own Sphinx pages with warnings treated as errors:

```bash
make docs
```

The build writes `build/docs/index.html` and embeds the canonical report through
`benched.sphinx`.

## Test installed distributions

Build and validate both Python distributions, then install each into a fresh virtual
environment:

```bash
make dist
make test-dist
```

Each installed artifact must collect and run a benchmark, save history, generate a
static HTML report with packaged assets, and build a Sphinx page from those results.
The isolated installations require package-index access for runtime and Sphinx
dependencies.
