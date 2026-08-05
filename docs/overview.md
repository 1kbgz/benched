# Benched report example

This page embeds a Benched report directly in Sphinx. Benched records
pytest-benchmark measurements in the active Python environment, keeps immutable
history, compares saved runs, and generates static reports for standalone sites or
existing documentation.

## Embedded report

This report exercises Benched's own benchmark suite, synthetic history generator,
Sphinx extension, and packaged Web Component. The documentation build records the
current suite once, then backfills 30 revisions across five machines and three Python
versions.

```{benched} ../build/docs-results
:view: trend
:metric: median
:x-axis: version
```
