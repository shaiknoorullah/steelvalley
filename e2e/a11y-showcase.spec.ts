import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Component showcase a11y", () => {
  test("no critical axe violations on /dev/components", async ({ page }) => {
    await page.goto("/dev/components");
    await page.waitForSelector("h1");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    const critical = results.violations.filter((v) => v.impact === "critical");
    expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
  });

  // The App Router root layout sets <html lang="ar" dir="rtl">. The Pages Router
  // legacy site still owns `/` until Plan 2 introduces the `[locale]` segment,
  // so we assert the App Router root attributes on an App Router route instead.
  test("App Router root has lang=ar dir=rtl and passes axe", async ({ page }) => {
    await page.goto("/app-router-health");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("lang", "ar");
    await expect(html).toHaveAttribute("dir", "rtl");

    const results = await new AxeBuilder({ page }).withTags(["wcag2aa"]).analyze();
    const critical = results.violations.filter((v) => v.impact === "critical");
    expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
  });
});
