import { test, expect } from "@playwright/test";

async function select(page, selector, value) {
  await page.locator(selector).evaluate((element, selected) => {
    element.value = selected;
    element.dispatchEvent(new Event("change", { bubbles: true }));
  }, value);
}

async function toggle(page, panel, label) {
  await page
    .locator(panel)
    .getByRole("button", { name: label, exact: true })
    .click();
}

function largeReport(runCount = 44, benchmarkCount = 615) {
  const machines = [
    ["linux-arm", "Linux", "arm64", 8],
    ["linux-x86", "Linux", "x86_64", 16],
    ["macos-arm", "Darwin", "arm64", 32],
    ["windows-x86", "Windows", "AMD64", 24],
    ["cloud-x86", "Linux", "x86_64", 4],
  ];
  const pythons = ["3.11.9", "3.12.13", "3.13.7"];
  const runs = [];
  for (let revision = 0; revision < runCount; revision += 1) {
    const [machine, platform, architecture, memory] =
      machines[revision % machines.length];
    const python = pythons[Math.floor(revision / machines.length) % 3];
    const runId = `run-${revision}-${machine}-${python}`;
    runs.push({
      run_id: runId,
      started_at: new Date(Date.UTC(2026, 0, revision + 1)).toISOString(),
      status: "success",
      suite: { name: "benched", revision: `suite-${revision}` },
      subject: {
        name: "benched",
        version: `0.${revision}.0`,
        revision: `subject-${revision}`,
      },
      machine: { id: machine, metadata: { memory_gib: memory } },
      environment: {
        python_version: python,
        platform,
        architecture,
      },
    });
  }
  const benchmarks = Array.from({ length: benchmarkCount }, (_, index) => ({
    benchmark_id: `benchmarks/test_benched.py::test_compile_report|case=${index}`,
    nodeid: `benchmarks/test_benched.py::test_compile_report[${index}]`,
    name: `test_compile_report[${index}]`,
    group: "report",
    parameters: { case: index },
    unit: "seconds",
    series: runs.map((run, runIndex) => {
      const median = 2 + index / benchmarkCount + runIndex / runs.length;
      return {
        run_id: run.run_id,
        metrics: {
          median,
          mean: median * 1.02,
          min: median * 0.95,
          max: median * 1.08,
          ops: 1 / median,
          peak_memory: 67_108_864 + index * 1024 + runIndex,
        },
      };
    }),
  }));
  return {
    schema_version: 1,
    generated_at: "2026-04-10T00:00:00+00:00",
    source_run_ids: runs.map((run) => run.run_id),
    runs,
    benchmarks,
    warnings: [],
  };
}

const SPHINX_THEMES = [
  {
    name: "Furo",
    signal: "furo",
    tokens: {
      accent: "--color-brand-primary",
      grid: "--color-background-border",
      muted: "--color-foreground-muted",
      surface: "--color-background-primary",
      text: "--color-foreground-primary",
    },
  },
  {
    name: "Fuma",
    signal: "fuma",
    tokens: {
      accent: "--color-fd-primary",
      grid: "--color-fd-border",
      muted: "--color-fd-muted-foreground",
      surface: "--color-fd-background",
      text: "--color-fd-foreground",
    },
  },
  {
    name: "Sphinx Awesome",
    signal: "sphinxawesome",
    tokens: {
      accent: "--color-primary",
      grid: "--color-border",
      muted: "--color-muted-foreground",
      surface: "--color-background",
      text: "--color-foreground",
    },
  },
  {
    name: "PyData",
    signal: "pydata",
    tokens: {
      accent: "--pst-color-primary",
      grid: "--pst-color-border",
      muted: "--pst-color-text-muted",
      surface: "--pst-color-background",
      text: "--pst-color-text-base",
    },
  },
  {
    name: "Shibuya",
    signal: "shibuya",
    tokens: {
      accent: "--sy-c-link",
      grid: "--sy-c-divider",
      muted: "--sy-c-light",
      surface: "--sy-c-background",
      text: "--sy-c-text",
    },
  },
];

const THEME_PALETTES = {
  dark: {
    accent: "rgb(61, 148, 255)",
    grid: "rgb(48, 51, 53)",
    muted: "rgb(129, 134, 141)",
    surface: "rgb(19, 20, 22)",
    text: "rgb(207, 208, 208)",
  },
  light: {
    accent: "rgb(10, 75, 255)",
    grid: "rgb(220, 221, 222)",
    muted: "rgb(90, 91, 92)",
    surface: "rgb(250, 251, 252)",
    text: "rgb(20, 21, 22)",
  },
};

async function applySphinxTheme(page, theme, mode) {
  await page.evaluate(
    ({ mode, palette, signal, tokens }) => {
      const source =
        signal === "furo" ? document.body : document.documentElement;
      for (const [role, property] of Object.entries(tokens)) {
        source.style.setProperty(property, palette[role]);
      }
      document.body.style.backgroundColor = palette.surface;
      document.body.style.color = palette.text;
      if (signal === "furo") document.body.dataset.theme = mode;
      if (signal === "sphinxawesome")
        document.documentElement.classList.toggle("dark", mode === "dark");
      if (signal === "fuma" || signal === "shibuya") {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(mode);
      }
      if (signal === "pydata") {
        document.documentElement.dataset.mode = mode;
        document.documentElement.dataset.theme = mode;
      }
    },
    { mode, palette: THEME_PALETTES[mode], ...theme },
  );
}

async function reportPalette(report) {
  return report.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      accent: style.getPropertyValue("--_benched-accent-color").trim(),
      grid: style.getPropertyValue("--_benched-grid-color").trim(),
      muted: style.getPropertyValue("--wa-color-text-quiet").trim(),
      surface: style.getPropertyValue("--wa-color-surface-default").trim(),
      text: style.getPropertyValue("--wa-color-text-normal").trim(),
    };
  });
}

test.describe("Benched report", () => {
  test("loads report data and changes among every view", async ({ page }) => {
    await page.goto("/");
    const report = page.locator("benched-report");

    const pythonCard = report
      .locator(".benched-summary-grid wa-card")
      .filter({ hasText: "Python Versions" });
    await expect(pythonCard).toContainText("2");
    await expect(report.locator(".benched-metric-select")).toHaveCount(0);
    await select(page, ".benched-view-select", "trend");
    await expect(report).toHaveAttribute("view", "trend");
    await expect(report.locator(".benched-trend-card")).toHaveCount(2);
    await expect(
      report.locator(".benched-mini-chart canvas").first(),
    ).toBeVisible();
    await expect(report.locator(".benched-benchmark-select")).toHaveJSProperty(
      "value",
      "all",
    );
    await select(page, ".benched-benchmark-select", "benchmark-0");
    await expect(report.locator(".benched-chart canvas").first()).toBeVisible();
    await expect(report.locator('a[href*="tradingview.com"]')).toHaveCount(0);
    await expect(report.locator(".benched-chart-legend span")).toHaveCount(2);
    await expect(report.locator(".benched-chart-legend")).toContainText(
      "linux · Python 3.12 · 16 GiB",
    );
    await expect(report.locator(".benched-chart-legend")).toContainText(
      "macos · Python 3.13 · 32 GiB",
    );
    await expect(report.locator(".benched-chart")).toHaveAttribute(
      "aria-label",
      /by package version$/,
    );
    await select(page, ".benched-view-select", "comparison");
    await expect(report.locator(".benched-table")).toBeVisible();
    await select(page, ".benched-view-select", "trend");
    await select(page, ".benched-x-axis-select", "time");
    await expect(report).toHaveAttribute("x-axis", "time");
    await toggle(page, ".benched-machine-select", "macos");
    await expect(report.locator(".benched-chart-legend span")).toHaveCount(1);
    await expect(report).toHaveAttribute("machine", "linux");
    await expect(report.locator(".benched-chart-value")).toContainText(
      "median:",
    );
    const priceFormat = await page.evaluate(async () => {
      const module = await import("/cdn/index.js");
      return module.chartPriceFormat([0.00009, 0.0001, 0.00012]);
    });
    expect(priceFormat).toEqual({
      type: "price",
      precision: 6,
      minMove: 0.000001,
    });
    const lineSpan = await report
      .locator(".benched-chart")
      .evaluate(async (element) => {
        await new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        );
        const canvas = element.querySelectorAll("canvas")[0];
        const context = canvas.getContext("2d");
        const pixels = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height,
        ).data;
        const candidates = [];
        const rows = new Map();
        for (let index = 0; index < pixels.length; index += 4) {
          const red = pixels[index];
          const green = pixels[index + 1];
          const blue = pixels[index + 2];
          if (blue > 200 && blue > red * 1.4 && blue > green * 1.25) {
            const x = (index / 4) % canvas.width;
            const y = Math.floor(index / 4 / canvas.width);
            candidates.push({ x, y });
            rows.set(y, (rows.get(y) ?? 0) + 1);
          }
        }
        const guide = [...rows].sort((left, right) => right[1] - left[1])[0][0];
        const line = candidates.filter(({ y }) => Math.abs(y - guide) > 2);
        const minimum = Math.min(...line.map(({ x }) => x));
        const maximum = Math.max(...line.map(({ x }) => x));
        return (maximum - minimum) / canvas.width;
      });
    expect(lineSpan).toBeGreaterThan(0.5);
    expect(
      await page.evaluate(() => customElements.get("wa-select") !== undefined),
    ).toBe(true);
  });

  test("multi-selects machines, Python feature versions, and memory", async ({
    page,
  }) => {
    await page.goto("/");
    await select(page, ".benched-view-select", "comparison");
    await select(page, ".benched-benchmark-select", "benchmark-1");
    await expect(page.locator("benched-report tbody tr")).toHaveCount(1);
    await toggle(page, ".benched-python-select", "3.13");
    await toggle(page, ".benched-machine-select", "macos");
    await toggle(page, ".benched-memory-select", "32 GiB");

    const report = page.locator("benched-report");
    await expect(report).toHaveAttribute("machine", "linux");
    await expect(report).toHaveAttribute("python", "3.12");
    await expect(report).toHaveAttribute("memory", "16");
    await expect(report.locator("tbody tr")).toHaveCount(1);
    await select(page, ".benched-metric-select", "ops");
    await expect(report.locator("thead")).toContainText("ops");
  });

  test("applies hidden preselected controls", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      const compact = document.createElement("benched-report");
      compact.setAttribute("src", "report.json");
      compact.setAttribute("view", "trend");
      compact.setAttribute("metric", "mean");
      compact.setAttribute("x-axis", "time");
      compact.setAttribute(
        "benchmark",
        "tests/test_parse.py::test_parse|size=100",
      );
      compact.setAttribute("machine", "linux");
      compact.setAttribute("python", "3.12");
      compact.setAttribute("memory", "16");
      compact.setAttribute(
        "hide-controls",
        "view,metric,x-axis,benchmark,machine,python,memory,theme",
      );
      document.body.append(compact);
    });

    const report = page.locator("benched-report").nth(1);
    await expect(report.locator(".benched-controls")).toHaveCount(0);
    await expect(report.locator("h2")).toHaveText("test_parse[100]");
    await expect(report.locator("thead")).toContainText("mean");
    await expect(report.locator(".benched-chart")).toHaveAttribute(
      "aria-label",
      /by time$/,
    );
    await expect(report.locator(".benched-chart-legend span")).toHaveCount(1);
  });

  test("links every overview benchmark to its trend", async ({ page }) => {
    await page.goto("/");
    const report = page.locator("benched-report");

    await expect(report.locator(".benched-benchmark-list a")).toHaveCount(2);
    await report.getByRole("link", { name: "test_parse[1000]" }).click();
    await expect(report).toHaveAttribute("view", "trend");
    await expect(report).toHaveAttribute(
      "benchmark",
      "tests/test_parse.py::test_parse|size=1000",
    );
    await expect(report.locator("h2")).toHaveText("test_parse[1000]");
  });

  test("keeps controls available when filters have no matching runs", async ({
    page,
  }) => {
    await page.goto("/");
    await select(page, ".benched-view-select", "trend");
    await toggle(page, ".benched-machine-select", "macos");
    await toggle(page, ".benched-memory-select", "16 GiB");

    const report = page.locator("benched-report");
    await expect(report.locator(".benched-view-message")).toContainText(
      "No benchmark data matches the selected filters.",
    );
    await expect(report.locator(".benched-card")).toBeVisible();
    await expect(report.locator(".benched-controls")).toBeVisible();
    await expect(report).toHaveAttribute("machine", "linux");
    await expect(report).toHaveAttribute("memory", "32");

    await toggle(page, ".benched-memory-select", "16 GiB");
    await expect(report.locator(".benched-trend-card")).toHaveCount(2);

    await toggle(page, ".benched-machine-select", "macos");
    await select(page, ".benched-benchmark-select", "benchmark-1");
    await toggle(page, ".benched-machine-select", "linux");
    await expect(report.locator(".benched-view-message")).toContainText(
      "No benchmark data matches the selected filters.",
    );
    await expect(report.locator(".benched-benchmark-select")).toHaveJSProperty(
      "value",
      "benchmark-0",
    );
    await select(page, ".benched-benchmark-select", "all");
    await expect(report.locator(".benched-trend-card")).toHaveCount(1);
  });

  test("detects and persists the preferred color scheme", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    const report = page.locator("benched-report");

    await expect(report).toHaveAttribute("data-resolved-theme", "dark");
    const toggle = page.locator(".benched-theme-toggle");
    await expect(toggle).toHaveAttribute("aria-label", "Switch to light mode");
    await expect(toggle.locator('[data-icon="sun"]')).toBeVisible();
    await expect(toggle).toHaveText("");
    const layout = await page.evaluate(() => {
      const title = document.querySelector(".benched-header > div");
      const controls = document.querySelector(".benched-controls");
      const benchmark = document.querySelector(".benched-benchmark-select");
      const theme = document.querySelector(".benched-theme-toggle");
      if (!title || !controls || !benchmark || !theme) return null;
      return {
        benchmarkBottom: benchmark.getBoundingClientRect().bottom,
        controlsTop: controls.getBoundingClientRect().top,
        themeBottom: theme.getBoundingClientRect().bottom,
        titleBottom: title.getBoundingClientRect().bottom,
      };
    });
    expect(layout).not.toBeNull();
    expect(layout.controlsTop).toBeGreaterThan(layout.titleBottom);
    expect(Math.abs(layout.themeBottom - layout.benchmarkBottom)).toBeLessThan(
      2,
    );
    expect(
      await page.locator("body").evaluate((element) => {
        return getComputedStyle(element).backgroundColor;
      }),
    ).not.toBe("rgb(255, 255, 255)");
    await toggle.click();
    await expect(report).toHaveAttribute("data-resolved-theme", "light");
    await expect(toggle.locator('[data-icon="moon"]')).toBeVisible();
    expect(
      await page.evaluate(() => localStorage.getItem("benched-theme")),
    ).toBe("light");

    await page.reload();
    await expect(report).toHaveAttribute("data-resolved-theme", "light");
  });

  test("exposes controls and values to keyboard and assistive technology", async ({
    page,
  }) => {
    await page.goto("/");
    const view = page.locator(".benched-view-select");
    await page.locator("body").click({ position: { x: 1, y: 1 } });
    await page.keyboard.press("Tab");

    await expect(view).toBeFocused();
    await expect(view).toHaveAttribute("label", "View");
    await select(page, ".benched-view-select", "trend");
    await select(page, ".benched-benchmark-select", "benchmark-0");
    await expect(
      page.getByRole("table", { name: /trend values/ }),
    ).toBeVisible();
    await page
      .locator(".benched-chart")
      .hover({ position: { x: 100, y: 100 } });
    await expect(page.locator(".benched-chart-value")).not.toBeEmpty();
  });

  test("supports multiple components and dark host themes", async ({
    page,
  }) => {
    await page.goto("/");
    await page.evaluate(() => {
      const second = document.createElement("benched-report");
      second.setAttribute("src", "report.json");
      second.setAttribute("view", "comparison");
      second.setAttribute("data-theme", "dark");
      document.body.append(second);
    });

    await expect(page.locator("benched-report")).toHaveCount(2);
    await expect(
      page.locator("benched-report").nth(1).locator("table"),
    ).toBeVisible();
    expect(
      await page
        .locator("benched-report")
        .nth(1)
        .evaluate((element) => getComputedStyle(element).colorScheme),
    ).toContain("dark");
    await expect(
      page.locator("benched-report").first().locator(".benched-summary-grid"),
    ).toBeVisible();
  });

  test("lets the page scroll over overview and detail charts", async ({
    page,
  }) => {
    await page.goto("/");
    await page.evaluate(() => {
      document.body.style.minHeight = "4000px";
    });
    await select(page, ".benched-view-select", "trend");

    const report = page.locator("benched-report");
    const overviewChart = report.locator(".benched-mini-chart").first();
    await expect(overviewChart.locator("canvas").first()).toBeVisible();
    await overviewChart.hover({ position: { x: 200, y: 100 } });
    await page.mouse.wheel(0, 500);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);

    await select(page, ".benched-benchmark-select", "benchmark-0");
    await page.evaluate(() => scrollTo(0, 0));
    const detailChart = report.locator(".benched-chart");
    await expect(detailChart.locator("canvas").first()).toBeVisible();
    await detailChart.hover({ position: { x: 200, y: 100 } });
    await page.mouse.wheel(0, 500);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
  });

  test("inherits and follows its host theme", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("benched-theme", "light");
      const host = document.createElement("section");
      host.id = "themed-host";
      host.style.colorScheme = "dark";
      host.style.backgroundColor = "rgb(18, 24, 32)";
      host.style.color = "rgb(230, 235, 242)";
      const embedded = document.createElement("benched-report");
      embedded.setAttribute("src", "report.json");
      embedded.setAttribute("view", "trend");
      embedded.setAttribute("data-theme", "inherit");
      host.append(embedded);
      document.body.append(host);
    });

    const report = page.locator("#themed-host benched-report");
    await expect(report).toHaveAttribute("data-resolved-theme", "dark");
    await expect(report.locator(".benched-theme-toggle")).toHaveCount(0);
    await expect(report.locator("canvas").first()).toBeVisible();
    await report.evaluate((element) => {
      window.__benchedCanvas = element.querySelector("canvas");
    });
    await page.locator("#themed-host").evaluate((host) => {
      host.classList.add("is-scrolling");
    });
    expect(
      await report.evaluate(
        (element) => window.__benchedCanvas === element.querySelector("canvas"),
      ),
    ).toBe(true);
    expect(
      await report.evaluate((element) => ({
        background: getComputedStyle(element).backgroundColor,
        color: getComputedStyle(element).color,
      })),
    ).toEqual({
      background: "rgba(0, 0, 0, 0)",
      color: "rgb(230, 235, 242)",
    });

    await page.locator("#themed-host").evaluate((host) => {
      host.style.colorScheme = "light";
      host.style.backgroundColor = "rgb(248, 250, 252)";
      host.style.color = "rgb(22, 28, 36)";
    });
    await expect(report).toHaveAttribute("data-resolved-theme", "light");
    await expect(report).toHaveCSS("color", "rgb(22, 28, 36)");
  });

  for (const benchmark of [null, "tests/test_parse.py::test_parse|size=100"]) {
    test(`isolates ${benchmark ? "detail" : "matrix"} chart layout from host tables`, async ({
      page,
    }) => {
      await page.goto("/");
      await page.addStyleTag({
        content: `
          .fd-prose table {
            width: 100%; margin: 1.25rem 0; border-collapse: separate;
            border-spacing: 0; border: 1px solid gray; border-radius: 0.75rem;
            font-size: 0.875rem; overflow: hidden;
          }
          .fd-prose td { border-bottom: 1px solid gray; padding: 0.75rem; }
        `,
      });
      const report = page.locator("benched-report");
      await expect(report.locator(".benched-summary-grid")).toBeVisible();
      await report.evaluate((element, benchmark) => {
        const host = document.createElement("main");
        host.className = "fd-prose";
        element.replaceWith(host);
        element.setAttribute("view", "trend");
        if (benchmark) element.setAttribute("benchmark", benchmark);
        host.append(element);
      }, benchmark);
      const chart = report
        .locator(benchmark ? ".benched-chart" : ".benched-mini-chart")
        .first();
      await expect(chart.locator("canvas").first()).toBeVisible();
      const heights = await chart.evaluate(async (element) => {
        const heights = [];
        for (let frame = 0; frame < 10; frame += 1) {
          await new Promise(requestAnimationFrame);
          heights.push(element.getBoundingClientRect().height);
        }
        return heights;
      });
      expect(heights).toEqual(Array(10).fill(benchmark ? 480 : 240));
      await expect(chart.locator("table")).toHaveCSS("margin", "0px");
      await expect(chart.locator("td").first()).toHaveCSS(
        "border-bottom-width",
        "0px",
      );
      if (benchmark) {
        await expect(report.locator(".benched-exact-values table")).toHaveCSS(
          "border-top-width",
          "1px",
        );
      }
    });

    test(`renders ${benchmark ? "detail" : "matrix"} charts with modern host colors`, async ({
      page,
    }) => {
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto("/");
      const report = page.locator("benched-report");
      await expect(report.locator(".benched-summary-grid")).toBeVisible();
      await report.evaluate((element, benchmark) => {
        const host = document.createElement("main");
        host.style.backgroundColor = "rgb(18, 24, 32)";
        host.style.color = "color(srgb 0.921569 0.921569 0.921569 / 0.9)";
        host.style.setProperty(
          "--benched-accent-color",
          "oklch(62.8% 0.258 29.23)",
        );
        host.style.setProperty(
          "--wa-color-orange-60",
          "color(display-p3 0 0 1)",
        );
        element.replaceWith(host);
        element.setAttribute("data-theme", "inherit");
        element.setAttribute("view", "trend");
        if (benchmark) element.setAttribute("benchmark", benchmark);
        host.append(element);
      }, benchmark);

      const chart = report
        .locator(benchmark ? ".benched-chart" : ".benched-mini-chart")
        .first();
      await expect(chart).toBeVisible();
      await chart.scrollIntoViewIfNeeded();
      await expect(chart.locator("canvas").first()).toBeVisible();
      await expect
        .poll(() =>
          chart.evaluate((element) => {
            const canvas = element.querySelector("canvas");
            const pixels = canvas
              .getContext("2d")
              .getImageData(0, 0, canvas.width, canvas.height).data;
            let red = 0;
            let blue = 0;
            let grid = 0;
            for (let index = 0; index < pixels.length; index += 4) {
              if (
                pixels[index] > 200 &&
                pixels[index + 1] < 60 &&
                pixels[index + 2] < 60 &&
                pixels[index + 3] > 200
              )
                red += 1;
              if (
                pixels[index] < 60 &&
                pixels[index + 1] < 60 &&
                pixels[index + 2] > 200 &&
                pixels[index + 3] > 200
              )
                blue += 1;
              if (
                pixels[index] > 225 &&
                pixels[index + 1] > 225 &&
                pixels[index + 2] > 225 &&
                pixels[index + 3] >= 45 &&
                pixels[index + 3] <= 55
              )
                grid += 1;
            }
            return { red: red > 20, blue: blue > 20, grid: grid > 20 };
          }),
        )
        .toMatchObject({
          red: true,
          grid: true,
          ...(benchmark ? { blue: true } : {}),
        });
      expect(errors).toEqual([]);
    });
  }

  for (const theme of SPHINX_THEMES) {
    test(`adapts to ${theme.name} light and dark modes`, async ({ page }) => {
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.emulateMedia({ colorScheme: "light" });
      await page.goto("/");
      await page.locator("benched-report").evaluate((element) => {
        const host = document.createElement("main");
        element.replaceWith(host);
        element.setAttribute("data-theme", "inherit");
        element.setAttribute("view", "trend");
        host.append(element);
      });

      const report = page.locator("benched-report");
      await applySphinxTheme(page, theme, "dark");
      await expect(report).toHaveAttribute("data-resolved-theme", "dark");
      expect(await reportPalette(report)).toEqual(THEME_PALETTES.dark);
      await expect(report.locator("canvas").first()).toBeVisible();
      await expect(report.locator(".benched-theme-toggle")).toHaveCount(0);

      const originalCanvas = await report
        .locator("canvas")
        .first()
        .elementHandle();
      await page.evaluate(({ signal, tokens }) => {
        const source =
          signal === "furo" ? document.body : document.documentElement;
        source.style.setProperty(tokens.accent, "rgb(180, 90, 210)");
      }, theme);
      await expect
        .poll(() => originalCanvas.evaluate((canvas) => canvas.isConnected))
        .toBe(false);
      expect((await reportPalette(report)).accent).toBe("rgb(180, 90, 210)");
      await expect(report.locator("canvas").first()).toBeVisible();

      await select(page, ".benched-benchmark-select", "benchmark-0");
      await expect(
        report.locator(".benched-chart canvas").first(),
      ).toBeVisible();
      await applySphinxTheme(page, theme, "light");
      await expect(report).toHaveAttribute("data-resolved-theme", "light");
      expect(await reportPalette(report)).toEqual(THEME_PALETTES.light);
      await expect(
        report.locator(".benched-chart canvas").first(),
      ).toBeVisible();
      expect(errors).toEqual([]);
    });

    test(`respects ${theme.name} mode signals over surface brightness`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme: "light" });
      await page.goto("/");
      await page.locator("benched-report").evaluate((element) => {
        const host = document.createElement("main");
        element.replaceWith(host);
        element.setAttribute("data-theme", "inherit");
        host.append(element);
      });
      await applySphinxTheme(page, theme, "dark");
      await page.locator("body").evaluate((body) => {
        body.style.backgroundColor = "white";
      });
      await expect(page.locator("benched-report")).toHaveAttribute(
        "data-resolved-theme",
        "dark",
      );
    });
  }

  test("follows OS changes in inherited auto mode", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await page.addStyleTag({
      content: `
      body[data-theme="auto"] { background: white; color: black; }
      @media (prefers-color-scheme: dark) {
        body[data-theme="auto"] { background: color(srgb 0.05 0.05 0.05); color: white; }
      }
    `,
    });
    const report = page.locator("benched-report");
    await report.evaluate((element) => {
      const host = document.createElement("main");
      element.replaceWith(host);
      document.body.dataset.theme = "auto";
      element.setAttribute("data-theme", "inherit");
      element.setAttribute("view", "trend");
      host.append(element);
    });
    await expect(report).toHaveAttribute("data-resolved-theme", "light");
    await expect(report.locator("canvas").first()).toBeVisible();
    await page.emulateMedia({ colorScheme: "dark" });
    await expect(report).toHaveAttribute("data-resolved-theme", "dark");
    await expect(report.locator("canvas").first()).toBeVisible();
    await page.emulateMedia({ colorScheme: "light" });
    await expect(report).toHaveAttribute("data-resolved-theme", "light");
  });

  test("preserves explicit report modes and custom palette overrides", async ({
    page,
  }) => {
    await page.goto("/");
    const report = page.locator("benched-report");
    await report.evaluate((element) => {
      const host = document.createElement("main");
      element.replaceWith(host);
      element.setAttribute("data-theme", "inherit");
      element.style.setProperty("--benched-accent-color", "rgb(180, 90, 210)");
      element.style.setProperty("--benched-grid-color", "rgb(60, 70, 80)");
      element.style.setProperty("--benched-muted-color", "rgb(100, 110, 120)");
      element.style.setProperty("--benched-surface-color", "rgb(20, 30, 40)");
      element.style.setProperty("--benched-text-color", "rgb(230, 240, 250)");
      host.append(element);
    });
    const theme = SPHINX_THEMES.find((theme) => theme.signal === "fuma");
    for (const mode of ["dark", "light"]) {
      await applySphinxTheme(page, theme, mode);
      await expect(report).toHaveAttribute("data-resolved-theme", mode);
      expect(await reportPalette(report)).toEqual({
        accent: "rgb(180, 90, 210)",
        grid: "rgb(60, 70, 80)",
        muted: "rgb(100, 110, 120)",
        surface: "rgb(20, 30, 40)",
        text: "rgb(230, 240, 250)",
      });
    }
    await report.evaluate((element) =>
      element.setAttribute("data-theme", "dark"),
    );
    await applySphinxTheme(page, theme, "light");
    await expect(report).toHaveAttribute("data-resolved-theme", "dark");
    await report.evaluate((element) =>
      element.setAttribute("data-theme", "light"),
    );
    await applySphinxTheme(page, theme, "dark");
    await expect(report).toHaveAttribute("data-resolved-theme", "light");
    await report.evaluate((element) =>
      element.setAttribute("data-theme", "inherit"),
    );
    await expect(report).toHaveAttribute("data-resolved-theme", "dark");
  });

  for (const property of ["--benched-text-color", "--color-fd-foreground"]) {
    test(`applies ${property} updates to chart axes`, async ({ page }) => {
      await page.goto("/");
      const report = page.locator("benched-report");
      await expect(report.locator(".benched-summary-grid")).toBeVisible();
      await report.evaluate((element, property) => {
        const host = document.createElement("main");
        host.style.color = "black";
        host.style.setProperty(property, "rgb(0, 255, 255)");
        element.replaceWith(host);
        element.setAttribute("data-theme", "inherit");
        element.setAttribute("view", "trend");
        host.append(element);
      }, property);
      await expect(report.locator("canvas").first()).toBeVisible();
      const originalCanvas = await report
        .locator("canvas")
        .first()
        .elementHandle();
      await report.evaluate((element, property) => {
        element.parentElement.style.setProperty(property, "rgb(255, 0, 255)");
      }, property);
      await expect
        .poll(() => originalCanvas.evaluate((canvas) => canvas.isConnected))
        .toBe(false);
      for (const selector of [".benched-mini-chart", ".benched-chart"]) {
        if (selector === ".benched-chart") {
          await select(page, ".benched-benchmark-select", "benchmark-0");
        }
        const chart = report.locator(selector).first();
        await expect(chart.locator("canvas").first()).toBeVisible();
        await expect
          .poll(() =>
            chart.evaluate((element) => {
              let colored = 0;
              for (const canvas of element.querySelectorAll("canvas")) {
                const pixels = canvas
                  .getContext("2d")
                  .getImageData(0, 0, canvas.width, canvas.height).data;
                for (let index = 0; index < pixels.length; index += 4) {
                  if (
                    pixels[index] > 240 &&
                    pixels[index + 1] < 15 &&
                    pixels[index + 2] > 240 &&
                    pixels[index + 3] > 150
                  )
                    colored += 1;
                }
              }
              return colored;
            }),
          )
          .toBeGreaterThan(20);
      }
    });
  }

  test("renders empty and fetch error states", async ({ page }) => {
    await page.route("**/empty.json", (route) =>
      route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          schema_version: 1,
          generated_at: "2026-01-01T00:00:00Z",
          source_run_ids: [],
          runs: [],
          benchmarks: [],
          warnings: [],
        }),
      }),
    );
    await page.goto("/");
    await page
      .locator("benched-report")
      .evaluate((element) => element.setAttribute("src", "empty.json"));
    await expect(
      page.getByText("No benchmark data matches this report."),
    ).toBeVisible();

    await page
      .locator("benched-report")
      .evaluate((element) => element.setAttribute("src", "missing.json"));
    await expect(page.getByRole("alert")).toContainText(
      "Unable to load report: 404",
    );
  });

  for (const axis of ["version", "time"]) {
    test(`renders only matching metrics in a mixed report by ${axis}`, async ({
      page,
    }) => {
      const data = largeReport(4, 2);
      const [timing, memory] = data.benchmarks;
      for (const point of timing.series) point.metrics.peak_memory = null;
      memory.name = "test_compile_report peak memory";
      memory.unit = "bytes";
      memory.series = memory.series.slice(0, 1);
      for (const point of memory.series) {
        point.metrics = {
          median: null,
          mean: null,
          min: null,
          max: null,
          ops: null,
          peak_memory: 67_108_864,
        };
      }
      await page.route("**/mixed-report.json", (route) =>
        route.fulfill({ contentType: "application/json", json: data }),
      );
      await page.goto("/");
      const report = page.locator("benched-report");
      await report.evaluate((element, axis) => {
        element.setAttribute("src", "mixed-report.json");
        element.setAttribute("view", "trend");
        element.setAttribute("x-axis", axis);
      }, axis);
      await expect(report.locator(".benched-header small")).toHaveText(
        "4 runs · 2 benchmarks",
      );
      const cards = report.locator(".benched-trend-card");
      for (const metric of [
        "median",
        "mean",
        "min",
        "max",
        "ops",
        "peak_memory",
      ]) {
        await select(page, ".benched-metric-select", metric);
        await expect(cards).toHaveCount(1);
        await expect(cards.locator("a")).toHaveText(
          metric === "peak_memory"
            ? "test_compile_report peak memory"
            : "test_compile_report[0]",
        );
        await expect(cards.locator("canvas").first()).toBeVisible();
      }
      await toggle(page, ".benched-machine-select", "linux-arm");
      await expect(cards).toHaveCount(0);
      await expect(report.locator(".benched-view-message")).toContainText(
        "No peak_memory data matches the selected filters.",
      );
      await expect(report.locator(".benched-metric-select")).toBeVisible();
      await select(page, ".benched-metric-select", "median");
      await expect(cards).toHaveCount(1);
      await expect(cards.locator("canvas").first()).toBeVisible();
    });
  }

  test("renders and filters a realistic large multi-machine report", async ({
    page,
  }, testInfo) => {
    test.setTimeout(120_000);
    const payload = JSON.stringify(largeReport());
    await page.route("**/large-report.json", (route) =>
      route.fulfill({ contentType: "application/json", body: payload }),
    );
    await page.goto("/");

    const started = Date.now();
    const report = page.locator("benched-report");
    await report.evaluate((element) =>
      element.setAttribute("src", "large-report.json"),
    );
    await expect(report.locator(".benched-header small")).toHaveText(
      "44 runs · 615 benchmarks",
    );
    await expect(report.locator(".benched-benchmark-list a")).toHaveCount(615);
    const overviewMilliseconds = Date.now() - started;

    await select(page, ".benched-view-select", "trend");
    const cards = report.locator(".benched-trend-card");
    await expect(cards).toHaveCount(615);
    await expect(
      report.locator(".benched-mini-chart canvas").first(),
    ).toBeVisible();
    await select(page, ".benched-metric-select", "peak_memory");
    await expect(
      report.locator(".benched-mini-chart canvas").first(),
    ).toBeVisible();
    expect(
      await report.locator(".benched-mini-chart:has(canvas)").count(),
    ).toBeLessThan(20);
    expect(
      await report.locator(".benched-mini-chart canvas").count(),
    ).toBeLessThan(120);
    await cards.last().scrollIntoViewIfNeeded();
    await expect(cards.last().locator("canvas").first()).toBeVisible();
    await expect(cards.first().locator("canvas")).toHaveCount(0);
    await expect
      .poll(() => report.locator(".benched-mini-chart:has(canvas)").count())
      .toBeLessThan(20);
    const matrixMilliseconds = Date.now() - started;
    await select(page, ".benched-benchmark-select", "benchmark-0");
    await expect(report.locator(".benched-chart canvas").first()).toBeVisible();
    await expect(report.locator(".benched-chart-legend span")).toHaveCount(15);
    await toggle(page, ".benched-machine-select", "windows-x86");
    await expect(report.locator(".benched-chart-legend span")).toHaveCount(12);
    const trendMilliseconds = Date.now() - started;

    await testInfo.attach("large-report-performance.json", {
      body: JSON.stringify(
        {
          bytes: new TextEncoder().encode(payload).length,
          points: 27_060,
          overview_milliseconds: overviewMilliseconds,
          matrix_milliseconds: matrixMilliseconds,
          trend_milliseconds: trendMilliseconds,
        },
        null,
        2,
      ),
      contentType: "application/json",
    });
    console.info(
      `large report: ${payload.length} bytes, overview ${overviewMilliseconds} ms, matrix ${matrixMilliseconds} ms, filtered trend ${trendMilliseconds} ms`,
    );
    expect(overviewMilliseconds).toBeLessThan(15_000);
    expect(matrixMilliseconds).toBeLessThan(20_000);
    expect(trendMilliseconds).toBeLessThan(20_000);
  });
});
