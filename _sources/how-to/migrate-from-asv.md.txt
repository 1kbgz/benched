# How to migrate ASV history to Benched

This guide shows you how to convert an existing ASV results directory into canonical
Benched history. The conversion reads saved JSON only; it does not install or invoke
ASV.

## Preview the migration

Locate the ASV `results` directory and its `asv.conf.json`, then run a dry import:

```bash
benched import-asv path/to/results \
  --asv-config path/to/asv.conf.json \
  --results-dir .benched/results \
  --dry-run
```

Benched reads ASV v1 and v2 result documents, uses `benchmarks.json` for parameter
axes, and reports how many runs it would import. Resolve malformed or unsupported
documents before continuing.

## Choose suite and subject identity

If the ASV project is both benchmark suite and code under test, identity is inferred
from `asv.conf.json`:

```bash
benched import-asv path/to/results \
  --asv-config path/to/asv.conf.json
```

If the benchmark repository measures an installed dependency, identify them
separately. For example, CSP benchmark history stores the CSP release in ASV's `csp`
environment parameter:

```bash
benched import-asv path/to/results \
  --asv-config path/to/asv.conf.json \
  --suite-name csp-benchmarks \
  --subject-name csp \
  --subject-version-param csp
```

Use `--subject-version VERSION` when all imported files measure one fixed version.
Use `--suite-repository` or `--subject-repository` when repository URLs cannot be
inferred.

## Import the history

Remove `--dry-run` after checking identity and destination:

```bash
benched import-asv path/to/results \
  --asv-config path/to/asv.conf.json \
  --results-dir .benched/results
```

The destination accepts the same local paths and fsspec URLs as `benched run`.
Deterministic source-derived run IDs make the operation idempotent; repeating the
same command skips runs already present.

## Verify the result

Inspect imported identities and parameterized measurements before removing the ASV
history:

```bash
benched history
benched show latest
benched report --format html --output build/migrated-benchmarks
benched serve build/migrated-benchmarks --open
```

Keep the original ASV results as a backup until the generated report contains the
expected machines, revisions, subject versions, parameter axes, and benchmark values.
ASV samples and available v2 statistics are preserved; unavailable parameterized
results remain explicit null measurements.
