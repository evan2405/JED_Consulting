import { test, expect } from "@playwright/test";
test("programme discovery supports expansion, filters, empty results and FAQ answers", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".course-card")).toHaveCount(6);
  const expand = page.getByRole("button", { name: /View all .* programmes/ });
  const total = Number((await expand.innerText()).match(/\d+/)[0]);
  await expand.click();
  await expect(page.locator(".course-card")).toHaveCount(total);
  await page.getByRole("button", { name: "Show fewer programmes" }).click();
  await expect(page.locator(".course-card")).toHaveCount(6);
  await page
    .getByRole("button", { name: "Career & language", exact: true })
    .click();
  await expect(page.locator(".course-card")).toHaveCount(6);
  await expect(
    page
      .locator(".course-card")
      .filter({ hasText: "German Language Coaching" }),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "Search courses" })
    .fill("no-such-programme");
  await expect(
    page.getByRole("heading", { name: "No courses found" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reset filters" }).click();
  await expect(
    page.getByRole("textbox", { name: "Search courses" }),
  ).toHaveValue("");
  await expect(
    page.getByRole("button", { name: "All programmes", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("textbox", { name: "Search courses" }).fill("  ACCA  ");
  await expect(page.locator(".course-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Clear search" }).click();
  await expect(page.locator(".course-card")).toHaveCount(6);
  const question = page
    .locator("details")
    .filter({ hasText: "Which course is right for me?" });
  await question.locator("summary").click();
  await expect(question.locator("p")).toBeVisible();
});

test("homepage, service navigation and full catalogue remain usable", async ({
  page,
  isMobile,
}) => {
  const failures = [];
  page.on("pageerror", (e) => failures.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "next chapter",
  );
  await expect(page.locator(".price")).toBeVisible();
  if (isMobile)
    await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("button", { name: "Services", exact: true }).click();
  await page
    .locator("#services-menu")
    .getByRole("link", { name: /^Financial(?: Counselling)?$/ })
    .click();
  await expect(page).toHaveURL(/\/financial$/);
  await page.goto("/");
  await page.locator("#courses").scrollIntoViewIfNeeded();
  await page.getByRole("textbox", { name: "Search courses" }).fill("ACCA");
  await expect(page.locator(".course-card")).toHaveCount(1);
  await page.locator(".course-card").click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("ACCA");
  await page.getByRole("link", { name: "Enquire about this course" }).click();
  await expect(page.getByLabel("Selected service")).toHaveValue("academic");
  await expect(page.getByLabel("Course *", { exact: true })).toHaveValue(
    "catalog-acca",
  );
  expect(failures).toEqual([]);
});
test("conditional form preserves values on failure and prevents duplicate sends", async ({
  page,
}) => {
  const failures = [];
  page.on("pageerror", (error) => failures.push(error.message));
  await page.addInitScript(() => {
    localStorage.setItem("jed-analytics", "accepted");
    window.enquiryEvents = [];
    window.gtag = (...args) => window.enquiryEvents.push(args);
  });
  await page.goto("/enquire?service=career&careerGoal=Placement");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByText("Enter your full name.")).toBeVisible();
  await page.getByLabel("Full name").fill("Test Visitor");
  await page.getByLabel("Email address").fill("visitor@example.com");
  await page.getByLabel("Phone with country code").fill("+919876543210");
  await page.getByLabel("Selected service").selectOption("financial");
  await expect(page.getByLabel("Career support")).toHaveCount(0);
  await page.getByLabel("Type of financial assistance").selectOption("Startup");
  await page.getByRole("checkbox").check();
  let attempts = 0,
    keys = [];
  await page.route("**/api/contact", async (route) => {
    attempts++;
    keys.push(route.request().headers()["idempotency-key"]);
    const body = route.request().postDataJSON();
    expect(body.careerGoal).toBe("");
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ error: "Temporary service issue." }),
    });
  });
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.locator(".form-error")).toContainText(
    "Temporary service issue.",
  );
  await expect(page.getByLabel("Full name")).toHaveValue("Test Visitor");
  await page.unroute("**/api/contact");
  await page.route("**/api/contact", async (route) => {
    attempts++;
    keys.push(route.request().headers()["idempotency-key"]);
    await new Promise((r) => setTimeout(r, 250));
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: '{"success":true}',
    });
  });
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(
    page.getByRole("button", { name: "Sending your enquiry" }),
  ).toBeDisabled();
  await expect(page).toHaveURL(/thank-you/);
  expect(attempts).toBe(2);
  expect(keys[0]).toBe(keys[1]);
  expect(failures).toEqual([]);
  const events = await page.evaluate(() => window.enquiryEvents);
  expect(
    events.filter(
      ([type, name]) => type === "event" && name === "enquiry_started",
    ),
  ).toHaveLength(1);
  expect(
    events.filter(
      ([type, name]) => type === "event" && name === "enquiry_submitted",
    ),
  ).toHaveLength(2);
});
test("public routes do not expose enquiry records or configuration", async ({
  request,
}) => {
  for (const path of [
    "/api/export-enquiries",
    "/api/export-enquiries?key=old-key",
    "/api/staff/leads",
    "/api/health/ready",
  ]) {
    const res = await request.get(path);
    expect(res.status()).toBe(401);
  }
  const health = await request.get("/api/health");
  expect(await health.json()).toEqual({ status: "ok" });
  const cross = await request.post("/api/contact", {
    headers: { Origin: "https://attacker.example" },
    data: {},
  });
  expect(cross.status()).toBe(403);
  const cron = await request.get("/api/cron/maintenance");
  expect(cron.status()).toBe(401);
});
test("mobile layout and keyboard navigation support reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.goto("/financial");
  await expect(
    page.getByRole("heading", { name: "Startup loans & funding" }),
  ).toBeVisible();
  await page.goto("/missing-page");
  await expect(
    page.getByRole("heading", { name: "Page Not Found" }),
  ).toBeVisible();
});
