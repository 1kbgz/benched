Benched documentation
=====================

Benched records pytest-benchmark measurements in the active Python environment,
keeps immutable history, compares saved runs, and generates static reports for
standalone sites or existing documentation.

.. toctree::
   :maxdepth: 2
   :caption: How-to guides

   how-to/run-in-prepared-environments
   how-to/import-pytest-benchmark
   how-to/migrate-from-asv
   how-to/customize-sphinx-report
   how-to/validate-release

Embedded report
---------------

This report is rendered by the same Sphinx extension and packaged Web Component
used by downstream documentation projects.

.. benched:: ../benched/tests/fixtures/canonical-report-v1.json
   :view: trend
   :metric: median
   :x-axis: version
