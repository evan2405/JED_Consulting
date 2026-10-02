import { test, expect } from "@playwright/test";

test("carousel code loads near visible controls, while hero and service links remain available", async ({
  page,
  isMobile,
}) => {
  const loadedChunks = new Set();
  const pending = [];
  page.on("response", (response) => {
    if (response.request().resourceType() === "script") {
      pending.push(
        response
          .text()
          .then((body) => {
            if (body.includes("data-carousel-ready"))
              loadedChunks.add(response.url());
          })
          .catch(() => {}),
      );
    }
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".service-card")).toHaveCount(3);
  await expect(page.locator(".hero-photo img")).not.toHaveAttribute(
    "loading",
    "lazy",
  );
  await Promise.all(pending);
  expect(loadedChunks.size).toBe(0);
  await expect(page.locator("[data-carousel-ready]")).toHaveCount(0);

  await page.locator("#services").scrollIntoViewIfNeeded();
  if (!isMobile) {
    // Desktop shows all cards and hides controls, so no control code is needed.
    await expect(page.locator(".carousel-controls")).toBeHidden();
    expect(loadedChunks.size).toBe(0);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator("#services").scrollIntoViewIfNeeded();
  }
  const rail = page.locator(".service-rail");
  const controls = page.locator(".carousel-controls");
  await expect(controls.locator("[data-carousel-ready]")).toBeAttached();
  await expect.poll(() => loadedChunks.size).toBeGreaterThan(0);
  await page
    .getByRole("button", { name: "Next services", exact: true })
    .click();
  await expect
    .poll(() => rail.evaluate((element) => element.scrollLeft))
    .toBeGreaterThan(0);
  await page
    .getByRole("button", { name: "Previous services", exact: true })
    .click();
  await expect
    .poll(() => rail.evaluate((element) => element.scrollLeft))
    .toBeLessThan(2);
});

test("browsers without IntersectionObserver can still use the carousel", async ({ page }) => {
  await page.addInitScript(() => { delete window.IntersectionObserver; });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("[data-carousel-ready]")).toBeAttached();
  await page.getByRole("button", { name: "Next services", exact: true }).click();
  await expect.poll(() => page.locator(".service-rail").evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  await page.locator('.service-card a[href="/counselling/career"]').click();
  await expect(page).toHaveURL(/\/counselling\/career$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Career");
});
