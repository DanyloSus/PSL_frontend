import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test("get started link", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // Click the get started link.
  await page.locator("a", { hasText: "Get started" }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(
    page.locator("h1, h2, h3, h4, h5, h6", { hasText: "Installation" })
  ).toBeVisible();
});
