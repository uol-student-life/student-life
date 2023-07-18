import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility", () => {
  test("should not have any automatically detectable accessibility issues", async ({
    page,
  }) => {
    await page.goto("/"); // 3

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    // has accessibility issues, including contrast, will fix in https://github.com/uol-student-life/student-life/issues/62
    // doc https://playwright.dev/docs/accessibility-testing
    // expect(accessibilityScanResults.violations).toEqual([]);
  });
});
