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

test.describe("Benched report", () => {
  test("loads report data and changes among every view", async ({ page }) => {
    await page.goto("/");
    const report = page.locator("benched-report");

    const pythonCard = report
      .locator(".benched-summary-grid wa-card")
      .filter({ hasText: "Python Versions" });
    await expect(pythonCard).toContainText("2");
    await expect(report.locator(".benched-metric-select")).toHaveCount(0);
    for (const view of ["trend", "comparison"]) {
      await select(page, ".benched-view-select", view);
      await expect(report).toHaveAttribute("view", view);
      await expect(report.locator(".benched-table")).toBeVisible();
    }
    await select(page, ".benched-view-select", "trend");
    await expect(report.locator(".benched-chart canvas").first()).toBeVisible();
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
});
