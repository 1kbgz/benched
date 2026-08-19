# How to embed and customize a Benched report in Sphinx

This guide shows you how to include a Benched report inline and transform its data
during a Sphinx build.

## Embed a report inline

Add the directive where you want the report to appear in a reStructuredText page:

```rst
.. benched:: ../benchmark-results
   :view: trend
   :metric: median
   :x-axis: version
```

Use the same directive in a MyST Markdown page:

````markdown
```{benched} ../benchmark-results
:view: trend
:metric: median
:x-axis: version
```
````

Both forms render the interactive report directly in the page. This documentation's
generated example data is embedded below. Sphinx reports inherit the surrounding
page's light or dark theme by default.

## Keep an embedded report compact

Preselect filters with directive options, then list controls that readers should not
change in `:hide-controls:`:

```rst
.. benched:: ../benchmark-results
   :view: trend
   :metric: median
   :x-axis: version
   :benchmark: tests/test_parse.py::test_parse|size=100
   :machine: linux,macos
   :python: 3.11,3.12
   :memory: 16,32
   :hide-controls: view,metric,x-axis,benchmark,machine,python,memory
```

Hidden controls do not disable their selections. Use `:theme: light` or `:theme: dark` to override the surrounding page; the default is `inherit`.

`:benchmark:` must be one exact benchmark ID because it selects the benchmark shown
by the component. When embedding a results directory, use a separate glob to reduce
the data compiled into the static report:

```rst
.. benched:: ../benchmark-results
   :view: trend
   :benchmark-filter: tests/test_parse.py::*
   :benchmark: tests/test_parse.py::test_parse|size=100
```

For a partial history, select the newest successful measurement independently for
each benchmark:

```rst
.. benched:: ../benchmark-results
    :selector: latest-per-benchmark
    :view: trend
```

`latest-per-benchmark` must be the only selector. Existing benchmark, group, and
parameter filters are applied before measurements are coalesced.

To keep one definition shared between the command line and documentation, name a
preset in `pyproject.toml` and reference it with `:preset:`:

```toml
[tool.benched.reports.solver]
benchmark = "*test_solver*"
metric = "median"
view = "trend"
latest_per_benchmark = true
```

```rst
.. benched:: ../benchmark-results
   :preset: solver
```

A preset may carry `benchmark`, `metric`, `view`, and either `latest` or
`latest_per_benchmark`. The preset's `benchmark` glob becomes `:benchmark-filter:`,
and `latest_per_benchmark` becomes `:selector: latest-per-benchmark`. Options given
explicitly on the directive override preset values. The same preset drives
`benched report --preset solver`. Aliases declared in `[tool.benched.aliases]` are
applied before reports are compiled, so renamed benchmarks keep one series.

Benched registers local report files and stored runs with Sphinx. Incremental builds
therefore regenerate embedded report data after those inputs change. Remote fsspec
sources are read when Sphinx rebuilds the document, but cannot notify Sphinx about
external changes.

This live example preselects two machines, two Python versions, and two memory buckets
while omitting their controls:

```{benched} ../../build/docs-results
:view: trend
:metric: median
:x-axis: version
:machine: demo-linux-x86,demo-macos-arm
:python: 3.11,3.12
:memory: 16,32
:hide-controls: view,metric,x-axis,benchmark,machine,python,memory
```

## Match the surrounding Sphinx theme

Inherited reports automatically follow Furo, Sphinx Awesome, and Shibuya in light
and dark modes. Benched uses each theme's semantic colors for chart accents, grid
lines, controls, surfaces, and text.

Override any inferred color from your documentation CSS:

```css
benched-report {
  --benched-accent-color: #7c3aed;
  --benched-grid-color: #d4d4d8;
  --benched-muted-color: #71717a;
  --benched-surface-color: #ffffff;
  --benched-text-color: #18181b;
}
```

These overrides apply when the report uses `:theme: inherit`. Use selectors from
your Sphinx theme when an override should differ between light and dark modes.

## Connect a report transformer

Add a callback and Sphinx `setup` function to `conf.py`:

```python
from benched.model import Report


def customize_benchmarks(app, report: Report, options: dict[str, str]):
    data = report.to_dict()
    data["benchmarks"] = [
        benchmark
        for benchmark in data["benchmarks"]
        if not benchmark["name"].startswith("internal_")
    ]
    data["warnings"].append("Internal benchmarks are hidden in this documentation.")
    return data


def setup(app):
    app.connect("benched-process-report", customize_benchmarks)
```

The callback receives the compiled `Report` and current directive options. Return a
`Report`, a report dictionary, or `None` to keep the original. Benched validates a
replacement against the report model before writing it.

The event runs after Benched loads report JSON or compiles stored runs and before it
writes `_static/benched/reports/*.json`. Benchmark execution is never part of the
Sphinx build.

## Apply options conditionally

Use the options argument when different directives need different presentation:

```python
def customize_benchmarks(app, report, options):
    data = report.to_dict()
    if options.get("view") == "overview":
        data["warnings"].append("Overview values are documentation-specific.")
    return data
```

Only the first event listener that returns a non-`None` value supplies the replacement
report. Keep shared transformations in one callback when several adjustments must be
composed.
