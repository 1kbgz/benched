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
