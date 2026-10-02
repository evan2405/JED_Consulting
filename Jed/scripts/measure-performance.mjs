import { chromium, devices } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

// Run against a production build. This measures local browser timings; it is
// neither Lighthouse nor a substitute for deployed real-user measurements.
const baseURL = process.env.PERF_BASE_URL || "http://localhost:3101";
const routes = [
  "/",
  "/courses",
  "/career",
  "/financial",
  "/counselling/academic",
  "/contact",
  "/enquire",
  "/courses/acca",
  "/courses/acca/demo",
  "/counselling",
  "/placements",
  "/updates",
  "/privacy-policy",
  "/terms-and-conditions",
];
const browser = await chromium.launch();
const results = [];
try {
  for (const [device, options] of [
    ["desktop", { viewport: { width: 1440, height: 900 } }],
    ["mobile", devices["iPhone 13"]],
  ]) {
    const context = await browser.newContext(options);
    const page = await context.newPage();
    await page.addInitScript(() => {
      window.perfSample = { lcp: 0, cls: 0 };
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries())
          window.perfSample.lcp = entry.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.perfSample.cls += entry.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    for (const route of routes) {
      const errors = [];
      const onError = (error) => errors.push(error.message);
      page.on("pageerror", onError);
      const response = await page.goto(baseURL + route, { waitUntil: "load" });
      await page.locator("h1").first().waitFor({ state: "visible" });
      // Allow the observer to deliver its final initial-render paint entries.
      await page.waitForTimeout(200);
      const metrics = await page.evaluate(() => {
        const nav = performance.getEntriesByType("navigation")[0];
        return {
          ttfb: Math.round(nav.responseStart),
          load: Math.round(nav.loadEventEnd),
          lcp: Math.round(window.perfSample.lcp),
          cls: Number(window.perfSample.cls.toFixed(4)),
          documentBytes: nav.encodedBodySize,
          scriptBytes: performance
            .getEntriesByType("resource")
            .filter((r) => r.initiatorType === "script")
            .reduce((total, r) => total + r.transferSize, 0),
          overflow: document.documentElement.scrollWidth > innerWidth,
        };
      });
      const result = {
        device,
        route,
        status: response.status(),
        ...metrics,
        errors,
      };
      results.push(result);
      console.log(JSON.stringify(result));
      page.off("pageerror", onError);
    }
    await context.close();
  }
} finally {
  await browser.close();
  const output = new URL(
    "../../artifacts/performance-audit.json",
    import.meta.url,
  );
  await mkdir(new URL(".", output), { recursive: true });
  await writeFile(
    output,
    JSON.stringify(
      {
        recordedAt: new Date().toISOString(),
        baseURL,
        throttled: false,
        results,
      },
      null,
      2,
    ),
  );
}
if (results.some((r) => r.status !== 200 || r.errors.length || r.overflow))
  process.exitCode = 1;
