import { test, expect } from "@playwright/test";

test("office map waits for a click and preserves the external directions link", async ({
  page,
}) => {
  let mapRequests = 0;
  await page.route("https://www.google.com/maps/embed**", async (route) => {
    mapRequests++;
    await route.fulfill({
      contentType: "text/html",
      body: "<html><body>Map loaded</body></html>",
    });
  });
  const response = await page.goto("/contact");
  expect(response.headers()["content-security-policy"]).toContain(
    "frame-src https://www.google.com/maps/embed",
  );
  await expect(
    page.getByRole("link", { name: "Get directions" }),
  ).toHaveAttribute("href", "https://maps.app.goo.gl/vKbXyQDLZSf2JzZG6");
  await expect(page.locator(".location-map iframe")).toHaveCount(0);
  expect(mapRequests).toBe(0);
  const frameBox = await page.locator(".location-map").boundingBox();
  await page.getByRole("button", { name: "Load Google Map" }).click();
  const map = page.locator(".location-map iframe");
  await expect(map).toHaveAttribute("loading", "lazy");
  await expect(map).toHaveAttribute("src", /1985553742015051706/);
  await expect(
    page.frameLocator(".location-map iframe").getByText("Map loaded"),
  ).toBeVisible();
  expect(mapRequests).toBe(1);
  expect((await page.locator(".location-map").boundingBox()).height).toBe(
    frameBox.height,
  );
});
