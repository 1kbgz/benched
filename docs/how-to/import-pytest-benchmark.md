# How to import pytest-benchmark history

This guide shows you how to move existing pytest-benchmark JSON files into Benched
history without rerunning the benchmarks.

## Preview the import

Pass one or more JSON files, or a directory containing JSON files:

```bash
benched import-pytest .benchmarks/ \
  --results-dir .benched/results \
  --dry-run
```

Directories are searched recursively. Fix invalid documents reported by the command
before continuing.

## Set suite and subject identity

Benched uses `[tool.benched.suite]` and `[tool.benched.subject]` by default. Override
them when the files belong to another suite:

```bash
benched import-pytest .benchmarks/ \
  --suite-name example-benchmarks \
  --suite-repository https://example.test/example-benchmarks \
  --subject-name example \
  --subject-repository https://example.test/example \
  --subject-version 1.2.3
```

The pytest-benchmark `commit_info` identifies the suite revision. For a separately
versioned subject, use `--subject-version` and optionally `--subject-revision`. If
files cover several subject releases, import each release's files in a separate
command with its matching identity.

Use `--machine NAME` only when the saved `machine_info.node` is missing or needs a
stable replacement.

## Choose whether to keep samples

Aggregate statistics are always imported. Add `--save-samples` on the first import
to retain `stats.data` arrays:

```bash
benched import-pytest .benchmarks/ --save-samples --dry-run
```

Imports are idempotent by source checksum and identity. Repeating an import skips the
existing run, so choose sample retention before removing `--dry-run`.

## Import the files

Remove `--dry-run` after checking the destination and identities:

```bash
benched import-pytest .benchmarks/ --results-dir .benched/results
```

The destination accepts the same local paths and fsspec URLs as `benched run`.
Benched records each source path and SHA-256 checksum in provenance.

pytest-benchmark JSON does not contain a session exit code or end timestamp. Imported
documents become successful point-in-time runs using their recorded `datetime` for
both timestamps.

## Verify the history

```bash
benched history
benched show latest
benched report --format html --output build/imported-benchmarks
benched serve build/imported-benchmarks --open
```

Check suite and subject identity, machine, Python version, parameters, statistics,
and source provenance before removing the original JSON files.
