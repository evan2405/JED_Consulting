import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("key public pages meet automated accessibility checks", async ({
  page,
}) => {
  test.setTimeout(90000);
  for (const path of [
    "/",
    "/enquire",
    "/financial",
    "/career",
    "/courses/acca",
    "/courses/acca/demo",
    "/placements",
    "/contact",
    "/updates",
    "/staff",
  ]) {
    await page.goto(path);
    const report = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(report.violations, path).toEqual([]);
  }
});
