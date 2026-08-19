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

const YARDANG_THEMES = [
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

async function applyYardangTheme(page, theme, mode) {
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
      if (signal === "shibuya") {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(mode);
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

  for (const theme of YARDANG_THEMES) {
    test(`adapts to ${theme.name} light and dark modes`, async ({ page }) => {
      await page.goto("/");
      await page.locator("benched-report").evaluate((element) => {
        const host = document.createElement("main");
        element.replaceWith(host);
        element.setAttribute("data-theme", "inherit");
        host.append(element);
      });

      const report = page.locator("benched-report");
      await applyYardangTheme(page, theme, "dark");
      await expect(report).toHaveAttribute("data-resolved-theme", "dark");
      expect(await reportPalette(report)).toEqual(THEME_PALETTES.dark);

      await applyYardangTheme(page, theme, "light");
      await expect(report).toHaveAttribute("data-resolved-theme", "light");
      expect(await reportPalette(report)).toEqual(THEME_PALETTES.light);
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
