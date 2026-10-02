import { test, expect } from "@playwright/test";

test("page links open at the top while section links keep their destination", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  await expect(page.locator("footer")).toBeAttached();
  await page
    .locator("footer")
    .getByRole("link", { name: "Courses", exact: true })
    .click();
  await expect(page).toHaveURL(/\/courses$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

  // Re-selecting the current page from the footer should also return to the top.
  await page
    .locator("footer")
    .getByRole("link", { name: "Courses", exact: true })
    .click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

  for (const [label, destination] of [
    ["Academic", "/counselling/academic"],
    ["Career", "/career"],
    ["Financial", "/financial"],
  ]) {
    await page.evaluate(() =>
      window.scrollTo({ top: 600, behavior: "instant" }),
    );
    if (isMobile)
      await page.getByRole("button", { name: "Open navigation" }).click();
    await page.getByRole("button", { name: "Services", exact: true }).click();
    await page
      .locator("#services-menu")
      .getByRole("link", {
        name: new RegExp("^" + label + "(?: Counselling)?$"),
      })
      .click();
    await expect(page).toHaveURL(new RegExp(destination + "$"));
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  }

  if (isMobile)
    await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Why J.ed" })
    .click();
  await expect(page).toHaveURL(/\/#about$/);
  await expect
    .poll(() =>
      page.evaluate(() => {
        const top = document
          .getElementById("about")
          ?.getBoundingClientRect().top;
        return top !== undefined && top >= 0 && top < innerHeight;
      }),
    )
    .toBe(true);

  await page
    .locator("footer")
    .getByRole("link", { name: "Contact us", exact: true })
    .click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});
