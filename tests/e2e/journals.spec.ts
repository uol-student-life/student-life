import { test, expect } from "@playwright/test";
import { resetDB } from "../helpers/reset-db";

test.afterAll(async () => {
  await resetDB();
});

test("Can save journal", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Save")).toBeVisible();
  await page.focus('div[contenteditable="true"]');
  await page.keyboard.type("New journal");
  await page.getByText("Save").click();
  const journalsSection = page.getByTestId("journals");
  await expect(journalsSection.getByText("New journal")).toBeVisible();
});
