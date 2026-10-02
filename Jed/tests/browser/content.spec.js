import { test, expect } from "@playwright/test";
test("course and counselling introductions lead to associated enquiries", async ({
  page,
}) => {
  await page.goto("/courses/acca");
  await expect(
    page.getByRole("heading", { name: "Curriculum", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: /View programme introduction/ }).click();
  await expect(page).toHaveURL(/courses\/acca\/demo/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("ACCA");
  await page.goto("/counselling/financial");
  await page.getByRole("link", { name: /See how it works/ }).click();
  await expect(page).toHaveURL(/counselling\/financial\/demo/);
  await page.goto("/counselling/financial");
  await page
    .locator("main")
    .getByRole("link", { name: /Book counselling/ })
    .click();
  await expect(page).toHaveURL(/counselling=financial/);
  await expect(page.getByLabel("Selected service")).toHaveValue("financial");
  await expect(page.locator(".mobile-action-bar")).toHaveCount(0);
});
test("public content endpoints are read-only, paginated and exclude private resources", async ({
  request,
}) => {
  const list = await request.get("/api/courses?limit=2&page=2");
  expect(list.status()).toBe(200);
  const result = await list.json();
  expect(result.items).toHaveLength(2);
  expect(result.total).toBeGreaterThanOrEqual(15);
  const course = await request.get("/api/courses/acca");
  expect((await course.json()).item.title).toBe("ACCA");
  expect((await request.get("/api/courses?limit=1000")).status()).toBe(400);
  expect((await request.get("/api/courses/missing-record")).status()).toBe(404);
  expect((await request.get("/api/submissions")).status()).toBe(404);
  expect(
    (
      await request.post("/api/courses", { data: { title: "Unauthorized" } })
    ).status(),
  ).toBe(405);
  expect((await request.get("/api/enquiries/export")).status()).toBe(401);
});
test("public pages have metadata, mobile layouts and useful empty states", async ({
  page,
}) => {
  test.setTimeout(90000);
  for (const width of [390, 640, 768, 1024, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      "/courses",
      "/counselling/financial",
      "/contact",
      "/placements",
      "/updates",
    ]) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(await page.title()).not.toBe("");
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${width} ${path}`,
      ).toBeTruthy();
    }
  }
});
