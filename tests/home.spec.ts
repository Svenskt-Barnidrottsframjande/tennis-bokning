import { test, expect } from "./support/test";

test("home page renders in Swedish", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Tennisbokning" })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "sv");
});
