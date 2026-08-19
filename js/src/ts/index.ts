import "@awesome.me/webawesome/dist/components/callout/callout.js";
import "@awesome.me/webawesome/dist/components/button/button.js";
import "@awesome.me/webawesome/dist/components/card/card.js";
import "@awesome.me/webawesome/dist/components/option/option.js";
import "@awesome.me/webawesome/dist/components/select/select.js";
import {
  ColorType,
  createChart,
  LineSeries,
  type IChartApi,
  type Time,
  type UTCTimestamp,
} from "lightweight-charts";

type Metric = "median" | "mean" | "min" | "max" | "ops" | "peak_memory";
type Theme = "light" | "dark";
type View = "overview" | "trend" | "comparison";
type XAxis = "version" | "time";
type Control =
  | "view"
  | "metric"
  | "x-axis"
  | "benchmark"
  | "machine"
  | "python"
  | "memory"
  | "theme";

interface ReportRun {
  run_id: string;
  started_at: string;
  status: string;
  suite: { name?: string; revision?: string | null };
  subject: { name?: string; version?: string | null; revision?: string | null };
  machine: { id?: string; metadata?: Record<string, unknown> };
  environment: { python_version?: string };
}

interface SeriesPoint {
  run_id: string;
  metrics: Partial<Record<Metric, number | null>>;
}

interface Benchmark {
  benchmark_id: string;
  nodeid: string;
  name: string;
  group: string | null;
  parameters: Record<string, unknown>;
  unit: string;
  series: SeriesPoint[];
}

interface SeriesGroup {
  label: string;
  machine: string;
  python: string;
  memory: string;
  points: SeriesPoint[];
}

interface Report {
  schema_version: number;
  generated_at: string;
  source_run_ids: string[];
  runs: ReportRun[];
  benchmarks: Benchmark[];
  warnings: string[];
}

interface ValueElement extends HTMLElement {
  value: string | string[] | null;
}

const METRICS: Metric[] = [
  "median",
  "mean",
  "min",
  "max",
  "ops",
  "peak_memory",
];
const VIEWS: View[] = ["overview", "trend", "comparison"];
const CONTROLS: Control[] = [
  "view",
  "metric",
  "x-axis",
  "benchmark",
  "machine",
  "python",
  "memory",
  "theme",
];
const SERIES_COLORS: Array<[string, string]> = [
  ["--_benched-accent-color", "#3e96ff"],
  ["--wa-color-orange-60", "#f46a45"],
  ["--wa-color-green-60", "#00ac49"],
  ["--wa-color-purple-60", "#b678f5"],
  ["--wa-color-pink-60", "#e66ba3"],
  ["--wa-color-cyan-60", "#00a3c0"],
  ["--wa-color-indigo-60", "#808aff"],
  ["--wa-color-yellow-60", "#da7e00"],
  ["--wa-color-red-60", "#f3676c"],
];

function selectedValue(event: Event): string {
  const value = (event.currentTarget as ValueElement).value;
  return typeof value === "string" ? value : "";
}

function formatValue(value: number | null | undefined): string {
  return value == null
    ? "—"
    : value.toLocaleString(undefined, { maximumSignificantDigits: 6 });
}

function pythonFeatureVersion(value: string | undefined): string {
  const match = value?.match(/^(\d+)\.(\d+)/);
  return match ? `${match[1]}.${match[2]}` : (value ?? "unknown");
}

function memoryBucket(run: ReportRun | undefined): string {
  const value = run?.machine.metadata?.memory_gib;
  return typeof value === "number" && Number.isFinite(value)
    ? String(value)
    : "unknown";
}

function memoryLabel(value: string): string {
  return value === "unknown" ? "Unknown" : `${value} GiB`;
}

function selectedValues(
  attribute: string | null,
  available: string[],
): Set<string> {
  if (attribute === null) return new Set(available);
  return new Set(
    attribute.split(",").filter((value) => available.includes(value)),
  );
}

export function chartPriceFormat(values: number[]) {
  const maximum = Math.max(
    0,
    ...values.filter(Number.isFinite).map((value) => Math.abs(value)),
  );
  const precision =
    maximum === 0
      ? 2
      : Math.min(12, Math.max(0, 2 - Math.floor(Math.log10(maximum))));
  return {
    type: "price" as const,
    precision,
    minMove: 10 ** -precision,
  };
}

function validateReport(value: unknown): Report {
  if (typeof value !== "object" || value === null) {
    throw new Error("report must be an object");
  }
  const report = value as Partial<Report>;
  if (report.schema_version !== 1) {
    throw new Error(
      `unsupported report schema version ${String(report.schema_version)}`,
    );
  }
  if (
    !Array.isArray(report.runs) ||
    !Array.isArray(report.benchmarks) ||
    !Array.isArray(report.warnings)
  ) {
    throw new Error("report is missing runs, benchmarks, or warnings");
  }
  return report as Report;
}

function table(
  headers: string[],
  rows: string[][],
  label: string,
): HTMLTableElement {
  const element = document.createElement("table");
  element.className = "benched-table";
  element.setAttribute("aria-label", label);
  const head = element.createTHead().insertRow();
  for (const header of headers) {
    const cell = document.createElement("th");
    cell.scope = "col";
    cell.textContent = header;
    head.append(cell);
  }
  const body = element.createTBody();
  for (const row of rows) {
    const tableRow = body.insertRow();
    for (const value of row) {
      const cell = tableRow.insertCell();
      cell.textContent = value;
    }
  }
  return element;
}

export class BenchedReport extends HTMLElement {
  static get observedAttributes() {
    return [
      "src",
      "view",
      "metric",
      "benchmark",
      "machine",
      "python",
      "memory",
      "x-axis",
      "hide-controls",
      "data-theme",
    ];
  }

  private report?: Report;
  private charts = new Map<HTMLElement, IChartApi>();
  private chartResizeObserver?: ResizeObserver;
  private chartVisibilityObserver?: IntersectionObserver;
  private chartRenderers = new Map<HTMLElement, () => void>();
  private request?: AbortController;
  private media?: MediaQueryList;
  private themeObserver?: MutationObserver;
  private inheritedChartStyle?: string;
  private theme: Theme = "light";

  private readonly handleMediaChange = (event: MediaQueryListEvent) => {
    if (this.inheritsTheme()) {
      this.setTheme(this.inheritedTheme());
    } else if (!this.savedTheme() && !this.getAttribute("data-theme")) {
      this.setTheme(event.matches ? "dark" : "light");
    }
  };

  private readonly handleThemeChange = (event: Event) => {
    if (!this.inheritsTheme()) {
      this.setTheme((event as CustomEvent<Theme>).detail);
    }
  };

  connectedCallback() {
    this.media = matchMedia("(prefers-color-scheme: dark)");
    this.theme = this.preferredTheme();
    this.applyTheme();
    this.media.addEventListener("change", this.handleMediaChange);
    window.addEventListener("benched-theme-change", this.handleThemeChange);
    this.observeInheritedTheme();
    void this.load();
  }

  disconnectedCallback() {
    this.request?.abort();
    this.removeChart();
    this.media?.removeEventListener("change", this.handleMediaChange);
    window.removeEventListener("benched-theme-change", this.handleThemeChange);
    this.themeObserver?.disconnect();
  }

  attributeChangedCallback(
    name: string,
    previous: string | null,
    current: string | null,
  ) {
    if (!this.isConnected || previous === current) return;
    if (name === "src") {
      void this.load();
    } else if (name === "data-theme") {
      const theme = this.preferredTheme();
      const changed = theme !== this.theme;
      this.setTheme(theme);
      if (!changed && this.report) this.render();
    } else if (this.report) {
      this.render();
    }
  }

  set data(value: unknown) {
    this.request?.abort();
    this.report = validateReport(value);
    if (this.isConnected) this.render();
  }

  get data(): Report | undefined {
    return this.report;
  }

  private get view(): View {
    const value = this.getAttribute("view") as View | null;
    return value && VIEWS.includes(value) ? value : "overview";
  }

  private get metric(): Metric {
    const value = this.getAttribute("metric") as Metric | null;
    return value && METRICS.includes(value) ? value : "median";
  }

  private get xAxis(): XAxis {
    return this.getAttribute("x-axis") === "time" ? "time" : "version";
  }

  private get hiddenControls(): Set<Control> {
    const values = this.getAttribute("hide-controls")?.split(",") ?? [];
    return new Set(
      values
        .map((value) => value.trim())
        .filter((value): value is Control =>
          CONTROLS.includes(value as Control),
        ),
    );
  }

  private savedTheme(): Theme | null {
    try {
      const value = localStorage.getItem("benched-theme");
      return value === "light" || value === "dark" ? value : null;
    } catch {
      return null;
    }
  }

  private preferredTheme(): Theme {
    const attribute = this.getAttribute("data-theme");
    if (attribute === "light" || attribute === "dark") return attribute;
    if (attribute === "inherit") return this.inheritedTheme();
    return this.savedTheme() ?? (this.media?.matches ? "dark" : "light");
  }

  private inheritsTheme(): boolean {
    return this.getAttribute("data-theme") === "inherit";
  }

  private inheritedTheme(): Theme {
    const parent = this.parentElement ?? document.documentElement;
    for (
      let element: HTMLElement | null = parent;
      element;
      element = element.parentElement
    ) {
      const match = getComputedStyle(element).backgroundColor.match(
        /^rgba?\(\s*([\d.]+)[, ]+\s*([\d.]+)[, ]+\s*([\d.]+)(?:[, /]+\s*([\d.]+))?\s*\)$/,
      );
      if (!match || (match[4] !== undefined && Number(match[4]) === 0))
        continue;
      const brightness =
        Number(match[1]) * 0.2126 +
        Number(match[2]) * 0.7152 +
        Number(match[3]) * 0.0722;
      return brightness < 128 ? "dark" : "light";
    }
    const schemes = getComputedStyle(parent).colorScheme.split(/\s+/);
    if (schemes[0] === "dark" || schemes[0] === "light") return schemes[0];
    return this.media?.matches ? "dark" : "light";
  }

  private observeInheritedTheme() {
    this.themeObserver?.disconnect();
    this.inheritedChartStyle = this.chartStyleSignature();
    this.themeObserver = new MutationObserver(() => {
      if (!this.inheritsTheme()) return;
      const theme = this.inheritedTheme();
      if (theme !== this.theme) {
        this.setTheme(theme);
        this.inheritedChartStyle = this.chartStyleSignature();
        return;
      }
      const chartStyle = this.chartStyleSignature();
      if (chartStyle === this.inheritedChartStyle) return;
      this.inheritedChartStyle = chartStyle;
      if (this.report) this.render();
    });
    for (
      let element = this.parentElement;
      element;
      element = element.parentElement
    ) {
      this.themeObserver.observe(element, {
        attributes: true,
        attributeFilter: ["class", "style", "data-theme"],
      });
    }
  }

  private chartStyleSignature(): string {
    const style = getComputedStyle(this);
    return [
      style.color,
      style.getPropertyValue("--_benched-grid-color"),
      ...SERIES_COLORS.map(([property]) => style.getPropertyValue(property)),
    ].join("\u0000");
  }

  private applyTheme() {
    this.classList.toggle("wa-dark", this.theme === "dark");
    this.classList.toggle("wa-light", this.theme === "light");
    this.dataset.resolvedTheme = this.theme;
  }

  private setTheme(theme: Theme) {
    if (theme !== "light" && theme !== "dark") return;
    if (this.theme === theme) {
      this.applyTheme();
      return;
    }
    this.theme = theme;
    this.applyTheme();
    if (this.report) this.render();
  }

  private toggleTheme() {
    const theme = this.theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem("benched-theme", theme);
    } catch {
      // The current page may disallow local storage; the in-page toggle still works.
    }
    window.dispatchEvent(
      new CustomEvent<Theme>("benched-theme-change", { detail: theme }),
    );
  }

  private async load() {
    this.request?.abort();
    const source = this.getAttribute("src");
    if (!source) {
      this.report = undefined;
      this.renderMessage("No report data source.");
      return;
    }
    this.renderMessage("Loading report…", "status");
    const request = new AbortController();
    this.request = request;
    try {
      const response = await fetch(source, { signal: request.signal });
      if (!response.ok)
        throw new Error(`${response.status} ${response.statusText}`);
      this.report = validateReport(await response.json());
      this.render();
    } catch (error) {
      if (request.signal.aborted) return;
      const detail = error instanceof Error ? error.message : String(error);
      this.report = undefined;
      this.renderMessage(`Unable to load report: ${detail}`, "alert");
    }
  }

  private renderMessage(message: string, role = "status") {
    this.removeChart();
    const callout = document.createElement("wa-callout");
    callout.className = "benched-message";
    callout.setAttribute(
      "appearance",
      role === "alert" ? "accent" : "outlined",
    );
    callout.setAttribute("role", role);
    callout.textContent = message;
    this.replaceChildren(callout);
  }

  private renderViewMessage(container: HTMLElement, message: string) {
    const callout = document.createElement("wa-callout");
    callout.className = "benched-message benched-view-message";
    callout.setAttribute("appearance", "outlined");
    callout.setAttribute("role", "status");
    callout.textContent = message;
    container.replaceChildren(callout);
  }

  private render() {
    this.removeChart();
    const report = this.report;
    if (!report) return;
    if (report.benchmarks.length === 0) {
      this.renderMessage("No benchmark data matches this report.");
      return;
    }

    this.innerHTML = `
      <wa-card class="benched-card" appearance="outlined" with-header>
        <div slot="header" class="benched-header">
          <div><strong>Benched report</strong><small></small></div>
          <div class="benched-controls" aria-label="Report controls"></div>
        </div>
        <div class="benched-warnings"></div>
        <section class="benched-view" aria-live="polite"></section>
      </wa-card>
    `;
    const summary = this.querySelector<HTMLElement>(".benched-header small");
    if (summary)
      summary.textContent = `${report.runs.length} runs · ${report.benchmarks.length} benchmarks`;
    this.renderControls();
    this.renderWarnings();
    const container = this.querySelector<HTMLElement>(".benched-view");
    if (!container) return;
    if (this.view === "overview") this.renderOverview(container);
    if (this.view === "trend") this.renderTrend(container);
    if (this.view === "comparison") this.renderComparison(container);
  }

  private select(
    label: string,
    className: string,
    values: Array<[string, string]>,
    current: string,
  ): HTMLElement {
    const select = document.createElement("wa-select") as ValueElement;
    select.className = className;
    select.setAttribute("label", label);
    select.setAttribute("size", "small");
    for (const [value, text] of values) {
      const option = document.createElement("wa-option");
      option.setAttribute("value", value);
      option.textContent = text;
      select.append(option);
    }
    select.value = current;
    return select;
  }

  private filterPanel(
    label: string,
    className: string,
    values: Array<[string, string]>,
    selected: Set<string>,
    update: (values: Set<string>) => void,
  ): HTMLElement {
    const fieldset = document.createElement("fieldset");
    fieldset.className = `benched-filter-panel ${className}`;
    const legend = document.createElement("legend");
    legend.textContent = label;
    const buttons = document.createElement("div");
    for (const [value, text] of values) {
      const button = document.createElement("wa-button");
      const active = selected.has(value);
      button.setAttribute("size", "small");
      button.setAttribute("appearance", active ? "filled" : "outlined");
      button.setAttribute("variant", active ? "brand" : "neutral");
      button.setAttribute("aria-pressed", String(active));
      button.textContent = text;
      button.addEventListener("click", () => {
        const next = new Set(selected);
        if (next.has(value)) {
          if (next.size === 1) return;
          next.delete(value);
        } else {
          next.add(value);
        }
        update(next);
      });
      buttons.append(button);
    }
    fieldset.append(legend, buttons);
    return fieldset;
  }

  private updateSelectionAttribute(
    name: string,
    selected: Set<string>,
    available: string[],
  ) {
    if (selected.size === available.length) {
      this.removeAttribute(name);
    } else {
      this.setAttribute(
        name,
        available.filter((value) => selected.has(value)).join(","),
      );
    }
  }

  private renderControls() {
    const report = this.report as Report;
    const hidden = this.hiddenControls;
    const controls = this.querySelector<HTMLElement>(
      ".benched-controls",
    ) as HTMLElement;
    const machines = [
      ...new Set(
        report.runs
          .map((run) => run.machine.id)
          .filter((value): value is string => Boolean(value)),
      ),
    ].sort();
    const activeMachines = selectedValues(
      this.getAttribute("machine"),
      machines,
    );
    const pythonVersions = [
      ...new Set(
        report.runs
          .map((run) => pythonFeatureVersion(run.environment.python_version))
          .filter((value): value is string => Boolean(value)),
      ),
    ].sort();
    const pythonAttribute = this.getAttribute("python");
    const activePython = selectedValues(
      pythonAttribute
        ?.split(",")
        .map((value) => pythonFeatureVersion(value))
        .join(",") ?? null,
      pythonVersions,
    );
    const memoryValues = [
      ...new Set(
        report.runs
          .map((run) => memoryBucket(run))
          .filter((value) => value !== "unknown"),
      ),
    ].sort((left, right) => Number(left) - Number(right));
    const activeMemory = selectedValues(
      this.getAttribute("memory"),
      memoryValues,
    );
    const visibleBenchmarks = this.visibleBenchmarks();
    const requestedBenchmark = this.getAttribute("benchmark") ?? "";
    const unavailableSelection = report.benchmarks.find(
      (benchmark) =>
        benchmark.benchmark_id === requestedBenchmark &&
        !visibleBenchmarks.includes(benchmark),
    );
    const benchmarks = unavailableSelection
      ? [unavailableSelection, ...visibleBenchmarks]
      : visibleBenchmarks;
    const activeBenchmarkIndex = benchmarks.findIndex(
      (benchmark) => benchmark.benchmark_id === requestedBenchmark,
    );
    const view = this.select(
      "View",
      "benched-view-select",
      VIEWS.map((value) => [value, value[0].toUpperCase() + value.slice(1)]),
      this.view,
    );
    const metric = this.select(
      "Metric",
      "benched-metric-select",
      METRICS.map((value) => [value, value]),
      this.metric,
    );
    const xAxis = this.select(
      "X axis",
      "benched-x-axis-select",
      [
        ["version", "Package version"],
        ["time", "Time"],
      ],
      this.xAxis,
    );
    const machine = this.filterPanel(
      "Machine",
      "benched-machine-select",
      machines.map((value) => [value, value]),
      activeMachines,
      (selected) =>
        this.updateSelectionAttribute("machine", selected, machines),
    );
    const python = this.filterPanel(
      "Python",
      "benched-python-select",
      pythonVersions.map((value) => [value, value]),
      activePython,
      (selected) =>
        this.updateSelectionAttribute("python", selected, pythonVersions),
    );
    const memory = this.filterPanel(
      "Memory",
      "benched-memory-select",
      memoryValues.map((value) => [value, memoryLabel(value)]),
      activeMemory,
      (selected) =>
        this.updateSelectionAttribute("memory", selected, memoryValues),
    );
    const benchmark = this.select(
      "Benchmark",
      "benched-benchmark-select",
      [
        ["all", "All benchmarks"],
        ...benchmarks.map(
          (value, index) =>
            [`benchmark-${index}`, value.name] as [string, string],
        ),
      ],
      activeBenchmarkIndex < 0 ? "all" : `benchmark-${activeBenchmarkIndex}`,
    );
    const theme = document.createElement("wa-button");
    theme.className = "benched-theme-toggle";
    theme.setAttribute("appearance", "plain");
    theme.setAttribute("size", "small");
    theme.setAttribute(
      "aria-label",
      `Switch to ${this.theme === "dark" ? "light" : "dark"} mode`,
    );
    theme.setAttribute(
      "title",
      `Switch to ${this.theme === "dark" ? "light" : "dark"} mode`,
    );
    theme.innerHTML =
      this.theme === "dark"
        ? `<svg data-icon="sun" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"></path>
          </svg>`
        : `<svg data-icon="moon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"></path>
          </svg>`;
    benchmark.toggleAttribute("disabled", benchmarks.length === 0);
    view.addEventListener("change", (event) =>
      this.setAttribute("view", selectedValue(event)),
    );
    metric.addEventListener("change", (event) =>
      this.setAttribute("metric", selectedValue(event)),
    );
    xAxis.addEventListener("change", (event) =>
      this.setAttribute("x-axis", selectedValue(event)),
    );
    benchmark.addEventListener("change", (event) => {
      const value = selectedValue(event);
      const selected = benchmarks[Number(value.replace("benchmark-", ""))];
      selected
        ? this.setAttribute("benchmark", selected.benchmark_id)
        : this.removeAttribute("benchmark");
    });
    theme.addEventListener("click", () => this.toggleTheme());
    if (!hidden.has("view")) controls.append(view);
    if (this.view !== "overview" && !hidden.has("metric"))
      controls.append(metric);
    if (this.view === "trend" && !hidden.has("x-axis")) controls.append(xAxis);
    if (!hidden.has("benchmark")) controls.append(benchmark);
    if (!hidden.has("theme") && !this.inheritsTheme()) controls.append(theme);
    const filters = document.createElement("div");
    filters.className = "benched-filter-panels";
    if (!hidden.has("machine")) filters.append(machine);
    if (!hidden.has("python")) filters.append(python);
    if (memoryValues.length > 0 && !hidden.has("memory"))
      filters.append(memory);
    if (filters.childElementCount > 0) controls.append(filters);
    if (controls.childElementCount === 0) controls.remove();
  }

  private renderWarnings() {
    const report = this.report as Report;
    const container = this.querySelector<HTMLElement>(
      ".benched-warnings",
    ) as HTMLElement;
    for (const warning of report.warnings) {
      const callout = document.createElement("wa-callout");
      callout.setAttribute("appearance", "outlined");
      callout.textContent = warning;
      container.append(callout);
    }
  }

  private activeMachines(): Set<string> {
    const report = this.report as Report;
    const available = [
      ...new Set(report.runs.map((run) => run.machine.id).filter(Boolean)),
    ] as string[];
    return selectedValues(this.getAttribute("machine"), available);
  }

  private activePythonVersions(): Set<string> {
    const report = this.report as Report;
    const available = [
      ...new Set(
        report.runs.map((run) =>
          pythonFeatureVersion(run.environment.python_version),
        ),
      ),
    ];
    const attribute = this.getAttribute("python");
    const normalized = attribute
      ?.split(",")
      .map((value) => pythonFeatureVersion(value))
      .join(",");
    return selectedValues(normalized ?? null, available);
  }

  private activeMemory(): Set<string> {
    const report = this.report as Report;
    const available = [
      ...new Set(
        report.runs
          .map((run) => memoryBucket(run))
          .filter((value) => value !== "unknown"),
      ),
    ];
    return selectedValues(this.getAttribute("memory"), available);
  }

  private activeRuns(): ReportRun[] {
    const report = this.report as Report;
    const machines = this.activeMachines();
    const pythonVersions = this.activePythonVersions();
    const memory = this.activeMemory();
    const filterMachines = this.hasAttribute("machine");
    const filterPython = this.hasAttribute("python");
    const filterMemory = this.hasAttribute("memory");
    return report.runs.filter(
      (run) =>
        (!filterMachines || machines.has(run.machine.id ?? "")) &&
        (!filterPython ||
          pythonVersions.has(
            pythonFeatureVersion(run.environment.python_version),
          )) &&
        (!filterMemory || memory.has(memoryBucket(run))),
    );
  }

  private visibleBenchmarks(): Benchmark[] {
    const report = this.report as Report;
    if (
      !this.hasAttribute("machine") &&
      !this.hasAttribute("python") &&
      !this.hasAttribute("memory")
    )
      return report.benchmarks;
    const runIds = new Set(this.activeRuns().map((run) => run.run_id));
    return report.benchmarks.filter((benchmark) =>
      benchmark.series.some((point) => runIds.has(point.run_id)),
    );
  }

  private activeBenchmark(): Benchmark | undefined {
    const benchmarks = this.visibleBenchmarks();
    const requested = this.getAttribute("benchmark");
    return benchmarks.find((benchmark) => benchmark.benchmark_id === requested);
  }

  private displayedBenchmarks(): Benchmark[] {
    const benchmarks = this.visibleBenchmarks();
    const requested = this.getAttribute("benchmark");
    if (!requested) return benchmarks;
    const selected = benchmarks.find(
      (benchmark) => benchmark.benchmark_id === requested,
    );
    return selected ? [selected] : [];
  }

  private points(benchmark: Benchmark): SeriesPoint[] {
    const runIds = new Set(this.activeRuns().map((run) => run.run_id));
    return benchmark.series.filter((point) => runIds.has(point.run_id));
  }

  private pointsBySeries(benchmark: Benchmark): SeriesGroup[] {
    const report = this.report as Report;
    const runs = new Map(report.runs.map((run) => [run.run_id, run]));
    const groups = new Map<string, SeriesGroup>();
    for (const point of this.points(benchmark)) {
      const run = runs.get(point.run_id);
      const machine = run?.machine.id ?? "unknown";
      const python = pythonFeatureVersion(run?.environment.python_version);
      const memory = memoryBucket(run);
      const key = `${machine}\u0000${python}\u0000${memory}`;
      const label = `${machine} · Python ${python}${memory === "unknown" ? "" : ` · ${memoryLabel(memory)}`}`;
      const group = groups.get(key) ?? {
        label,
        machine,
        python,
        memory,
        points: [],
      };
      group.points.push(point);
      groups.set(key, group);
    }
    return [...groups.values()].sort((left, right) =>
      left.label.localeCompare(right.label),
    );
  }

  private renderOverview(container: HTMLElement) {
    const runs = this.activeRuns();
    const benchmarks = this.visibleBenchmarks();
    if (runs.length === 0 || benchmarks.length === 0) {
      this.renderViewMessage(
        container,
        "No benchmark data matches the selected filters.",
      );
      return;
    }
    const machines = new Set(runs.map((run) => run.machine.id).filter(Boolean));
    const pythonVersions = new Set(
      runs.map((run) => pythonFeatureVersion(run.environment.python_version)),
    );
    const stats: Array<[string, string]> = [
      ["Runs", String(runs.length)],
      ["Benchmarks", String(benchmarks.length)],
      ["Machines", String(machines.size)],
      ["Python Versions", String(pythonVersions.size)],
    ];
    const grid = document.createElement("div");
    grid.className = "benched-summary-grid";
    for (const [label, value] of stats) {
      const card = document.createElement("wa-card");
      const output = document.createElement("strong");
      const caption = document.createElement("span");
      output.textContent = value;
      caption.textContent = label;
      card.append(output, caption);
      grid.append(card);
    }
    const heading = document.createElement("h2");
    heading.textContent = "Benchmarks";
    const list = document.createElement("ul");
    list.className = "benched-benchmark-list";
    const runById = new Map(runs.map((run) => [run.run_id, run]));
    for (const benchmark of benchmarks) {
      const points = this.points(benchmark);
      const contexts = points
        .map((point) => runById.get(point.run_id))
        .filter((run): run is ReportRun => Boolean(run));
      const benchmarkMachines = new Set(contexts.map((run) => run.machine.id));
      const benchmarkPythons = new Set(
        contexts.map((run) =>
          pythonFeatureVersion(run.environment.python_version),
        ),
      );
      const item = document.createElement("li");
      const link = document.createElement("a");
      const detail = document.createElement("span");
      link.href = `#${encodeURIComponent(benchmark.benchmark_id)}`;
      link.textContent = benchmark.name;
      link.addEventListener("click", (event) => {
        event.preventDefault();
        this.setAttribute("benchmark", benchmark.benchmark_id);
        this.setAttribute("view", "trend");
      });
      detail.textContent = `${points.length} points · ${benchmarkMachines.size} machines · ${benchmarkPythons.size} Python versions`;
      item.append(link, detail);
      list.append(item);
    }
    container.append(grid, heading, list);
  }

  private renderTrend(container: HTMLElement) {
    if (!this.hasAttribute("benchmark")) {
      this.renderTrendMatrix(container);
      return;
    }
    const benchmark = this.activeBenchmark();
    if (!benchmark) {
      this.renderViewMessage(
        container,
        "No benchmark data matches the selected filters.",
      );
      return;
    }
    const report = this.report as Report;
    const runs = new Map(report.runs.map((run) => [run.run_id, run]));
    const groups = this.pointsBySeries(benchmark)
      .map((group) => ({
        ...group,
        points: group.points.filter(
          (point) => point.metrics[this.metric] != null,
        ),
      }))
      .filter((group) => group.points.length > 0);
    const points = groups.flatMap((group) => group.points);
    if (points.length === 0) {
      this.renderViewMessage(
        container,
        `No ${this.metric} data matches the selected filters.`,
      );
      return;
    }
    const title = document.createElement("h2");
    title.textContent = benchmark.name;
    const value = document.createElement("output");
    value.className = "benched-chart-value";
    value.setAttribute("aria-live", "polite");
    value.textContent =
      groups.length === 1
        ? `${groups[0].label} · ${this.metric}: ${formatValue(groups[0].points[groups[0].points.length - 1]?.metrics[this.metric])} ${benchmark.unit}`
        : `${groups.length} series · ${this.metric}`;
    const legend = document.createElement("div");
    legend.className = "benched-chart-legend";
    legend.setAttribute("aria-label", "Chart series");
    const chartContainer = document.createElement("div");
    chartContainer.className = "benched-chart";
    chartContainer.setAttribute(
      "aria-label",
      `${benchmark.name} ${this.metric} by ${this.xAxis === "version" ? "package version" : "time"}`,
    );
    container.append(title, value, legend, chartContainer);

    const style = getComputedStyle(this);
    const axisLabels = new Map<number, string>();
    const versionCoordinates = new Map<string, UTCTimestamp>();
    if (this.xAxis === "version") {
      const orderedRuns = points
        .map((point) => runs.get(point.run_id))
        .filter((run): run is ReportRun => Boolean(run))
        .sort((left, right) => left.started_at.localeCompare(right.started_at));
      for (const run of orderedRuns) {
        const version =
          run.subject.version ?? run.subject.revision ?? run.run_id;
        if (versionCoordinates.has(version)) continue;
        const coordinate = (versionCoordinates.size + 1) as UTCTimestamp;
        versionCoordinates.set(version, coordinate);
        axisLabels.set(coordinate, version);
      }
    }
    const pointTime = (point: SeriesPoint): UTCTimestamp => {
      const run = runs.get(point.run_id);
      if (this.xAxis === "version") {
        const version =
          run?.subject.version ?? run?.subject.revision ?? point.run_id;
        return versionCoordinates.get(version) as UTCTimestamp;
      }
      return Math.floor(
        Date.parse(run?.started_at ?? "") / 1000,
      ) as UTCTimestamp;
    };
    const chart = createChart(chartContainer, {
      autoSize: true,
      height: 480,
      handleScale: false,
      handleScroll: false,
      layout: {
        attributionLogo: false,
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: style.color,
      },
      grid: {
        vertLines: {
          color:
            style.getPropertyValue("--_benched-grid-color").trim() || "#d8dee9",
        },
        horzLines: {
          color:
            style.getPropertyValue("--_benched-grid-color").trim() || "#d8dee9",
        },
      },
      localization:
        this.xAxis === "version"
          ? {
              timeFormatter: (time: Time) =>
                axisLabels.get(Number(time)) ?? "unknown",
            }
          : undefined,
      timeScale:
        this.xAxis === "version"
          ? {
              tickMarkFormatter: (time: Time) =>
                axisLabels.get(Number(time)) ?? "",
            }
          : undefined,
    });
    const priceFormat = chartPriceFormat(
      points.map((point) => point.metrics[this.metric] as number),
    );
    const series = groups.map((group, index) => {
      const [property, fallback] = SERIES_COLORS[index % SERIES_COLORS.length];
      const color = style.getPropertyValue(property).trim() || fallback;
      const line = chart.addSeries(LineSeries, {
        color,
        priceFormat,
        title: group.label,
      });
      const values = new Map<UTCTimestamp, number>();
      for (const point of group.points) {
        values.set(pointTime(point), point.metrics[this.metric] as number);
      }
      line?.setData(
        [...values]
          .sort(([left], [right]) => Number(left) - Number(right))
          .map(([time, pointValue]) => ({ time, value: pointValue })),
      );
      const item = document.createElement("span");
      const swatch = document.createElement("i");
      swatch.style.backgroundColor = color;
      item.append(swatch, group.label);
      legend.append(item);
      return { line, label: group.label };
    });
    chart.subscribeCrosshairMove((event) => {
      for (const item of series) {
        if (!item.line) continue;
        const datum = event.seriesData.get(item.line);
        if (datum && "value" in datum) {
          value.textContent = `${item.label} · ${this.metric}: ${formatValue(datum.value)} ${benchmark.unit}`;
          break;
        }
      }
    });
    this.trackChart(chartContainer, chart);

    const exactValues = groups
      .flatMap((group) =>
        group.points.map((point) => {
          const run = runs.get(point.run_id);
          return { group, point, run };
        }),
      )
      .sort((left, right) =>
        (right.run?.started_at ?? "").localeCompare(left.run?.started_at ?? ""),
      );
    const accessibleRows = exactValues
      .slice(0, 100)
      .map(({ group, point, run }) => [
        run?.started_at ?? point.run_id,
        run?.subject.version ?? "—",
        group.machine,
        run?.environment.python_version ?? group.python,
        memoryLabel(group.memory),
        formatValue(point.metrics[this.metric]),
      ]);
    const details = document.createElement("details");
    details.className = "benched-exact-values";
    details.open = exactValues.length <= 100;
    const summary = document.createElement("summary");
    summary.textContent = `Recent values (${accessibleRows.length} of ${exactValues.length})`;
    details.append(
      summary,
      table(
        ["Run", "Package", "Machine", "Python", "Memory", this.metric],
        accessibleRows,
        `${benchmark.name} recent trend values`,
      ),
    );
    container.append(details);
  }

  private renderTrendMatrix(container: HTMLElement) {
    const benchmarks = this.visibleBenchmarks();
    const activeRuns = this.activeRuns();
    if (activeRuns.length === 0 || benchmarks.length === 0) {
      this.renderViewMessage(
        container,
        "No benchmark data matches the selected filters.",
      );
      return;
    }

    const heading = document.createElement("h2");
    heading.textContent = "Benchmark trends";
    const description = document.createElement("p");
    description.className = "benched-trend-description";
    description.textContent = `Each line averages ${this.metric} across selected results at each ${this.xAxis === "version" ? "package version" : "day"}.`;
    const grid = document.createElement("div");
    grid.className = "benched-trend-grid";
    container.append(heading, description, grid);

    const runs = new Map(activeRuns.map((run) => [run.run_id, run]));
    const axisLabels = new Map<number, string>();
    const versionCoordinates = new Map<string, UTCTimestamp>();
    if (this.xAxis === "version") {
      for (const run of [...activeRuns].sort((left, right) =>
        left.started_at.localeCompare(right.started_at),
      )) {
        const version =
          run.subject.version ?? run.subject.revision ?? run.run_id;
        if (versionCoordinates.has(version)) continue;
        const coordinate = (versionCoordinates.size + 1) as UTCTimestamp;
        versionCoordinates.set(version, coordinate);
        axisLabels.set(coordinate, version);
      }
    }
    const pointTime = (point: SeriesPoint): UTCTimestamp => {
      const run = runs.get(point.run_id);
      if (this.xAxis === "version") {
        const version =
          run?.subject.version ?? run?.subject.revision ?? point.run_id;
        return versionCoordinates.get(version) as UTCTimestamp;
      }
      const timestamp = Date.parse(run?.started_at ?? "");
      return (Math.floor(timestamp / 86_400_000) * 86_400) as UTCTimestamp;
    };
    const style = getComputedStyle(this);
    const [property, fallback] = SERIES_COLORS[0];
    const color = style.getPropertyValue(property).trim() || fallback;

    for (const benchmark of benchmarks) {
      const values = new Map<UTCTimestamp, number[]>();
      const points = this.points(benchmark).filter(
        (point) => point.metrics[this.metric] != null,
      );
      for (const point of points) {
        const time = pointTime(point);
        const bucket = values.get(time) ?? [];
        bucket.push(point.metrics[this.metric] as number);
        values.set(time, bucket);
      }
      const data = [...values]
        .sort(([left], [right]) => Number(left) - Number(right))
        .map(([time, bucket]) => ({
          time,
          value:
            bucket.reduce((total, value) => total + value, 0) / bucket.length,
        }));

      const card = document.createElement("wa-card");
      card.className = "benched-trend-card";
      card.setAttribute("appearance", "outlined");
      card.setAttribute("with-header", "");
      const header = document.createElement("div");
      header.className = "benched-trend-card-header";
      header.setAttribute("slot", "header");
      const link = document.createElement("a");
      link.href = `#${encodeURIComponent(benchmark.benchmark_id)}`;
      link.textContent = benchmark.name;
      link.addEventListener("click", (event) => {
        event.preventDefault();
        this.setAttribute("benchmark", benchmark.benchmark_id);
      });
      const latest = document.createElement("span");
      latest.textContent = data.length
        ? `${formatValue(data[data.length - 1].value)} ${benchmark.unit}`
        : `No ${this.metric} data`;
      header.append(link, latest);
      const chartContainer = document.createElement("div");
      chartContainer.className = "benched-mini-chart";
      chartContainer.setAttribute(
        "aria-label",
        `${benchmark.name} aggregate ${this.metric} by ${this.xAxis === "version" ? "package version" : "time"}`,
      );
      card.append(header, chartContainer);
      grid.append(card);
      if (data.length === 0) continue;

      this.renderChartWhenVisible(chartContainer, () => {
        const chart = createChart(chartContainer, {
          autoSize: true,
          height: 240,
          handleScale: false,
          handleScroll: false,
          layout: {
            attributionLogo: false,
            background: { type: ColorType.Solid, color: "transparent" },
            textColor: style.color,
          },
          grid: {
            vertLines: {
              color:
                style.getPropertyValue("--_benched-grid-color").trim() ||
                "#d8dee9",
            },
            horzLines: {
              color:
                style.getPropertyValue("--_benched-grid-color").trim() ||
                "#d8dee9",
            },
          },
          localization:
            this.xAxis === "version"
              ? {
                  timeFormatter: (time: Time) =>
                    axisLabels.get(Number(time)) ?? "unknown",
                }
              : undefined,
          timeScale:
            this.xAxis === "version"
              ? {
                  tickMarkFormatter: (time: Time) =>
                    axisLabels.get(Number(time)) ?? "",
                }
              : undefined,
        });
        const line = chart.addSeries(LineSeries, {
          color,
          priceFormat: chartPriceFormat(data.map((point) => point.value)),
        });
        line.setData(data);
        this.trackChart(chartContainer, chart);
      });
    }
  }

  private renderComparison(container: HTMLElement) {
    const rows = this.displayedBenchmarks().flatMap((benchmark) =>
      this.pointsBySeries(benchmark).map((group) => {
        const values = group.points
          .map((point) => point.metrics[this.metric])
          .filter((value): value is number => value != null);
        const base = values[values.length - 2];
        const head = values[values.length - 1];
        const change =
          base == null || head == null || base === 0
            ? null
            : ((head - base) / base) * 100;
        return [
          benchmark.name,
          group.label,
          formatValue(base),
          formatValue(head),
          change == null
            ? "—"
            : `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`,
        ];
      }),
    );
    if (rows.length === 0) {
      this.renderViewMessage(
        container,
        "No benchmark data matches the selected filters.",
      );
      return;
    }
    container.append(
      table(
        [
          "Benchmark",
          "Context",
          `Previous ${this.metric}`,
          `Latest ${this.metric}`,
          "Change",
        ],
        rows,
        "Latest benchmark comparison",
      ),
    );
  }

  private trackChart(container: HTMLElement, chart: IChartApi) {
    this.charts.set(container, chart);
    this.chartResizeObserver ??= new ResizeObserver((entries) => {
      for (const entry of entries) {
        this.charts
          .get(entry.target as HTMLElement)
          ?.timeScale()
          .fitContent();
      }
    });
    this.chartResizeObserver.observe(container);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (this.charts.get(container) === chart)
          chart.timeScale().fitContent();
      });
    });
  }

  private renderChartWhenVisible(
    container: HTMLElement,
    renderChart: () => void,
  ) {
    if (!("IntersectionObserver" in window)) {
      renderChart();
      return;
    }
    this.chartRenderers.set(container, renderChart);
    this.chartVisibilityObserver ??= new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const target = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            if (!this.charts.has(target)) this.chartRenderers.get(target)?.();
          } else {
            this.removeTrackedChart(target);
          }
        }
      },
      { rootMargin: "480px 0px" },
    );
    this.chartVisibilityObserver.observe(container);
  }

  private removeTrackedChart(container: HTMLElement) {
    const chart = this.charts.get(container);
    if (!chart) return;
    this.chartResizeObserver?.unobserve(container);
    chart.remove();
    this.charts.delete(container);
  }

  private removeChart() {
    this.chartVisibilityObserver?.disconnect();
    this.chartVisibilityObserver = undefined;
    this.chartRenderers.clear();
    this.chartResizeObserver?.disconnect();
    this.chartResizeObserver = undefined;
    for (const chart of this.charts.values()) chart.remove();
    this.charts.clear();
  }
}

if (!customElements.get("benched-report")) {
  customElements.define("benched-report", BenchedReport);
}
