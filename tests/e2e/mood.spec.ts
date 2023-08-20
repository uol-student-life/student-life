import { test, expect, Page } from "@playwright/test";
import { resetDB } from "../helpers/reset-db";
import { fakeDate, createJournal } from "../e2e-utils";

test.afterAll(async () => {
  await resetDB();
});

test.describe("Mood", () => {
  test("can select/update mood", async ({ page }) => {
    await fakeDate(page, "July 11 2023 13:37:11");
    await page.route(/unsplash/, (route) => route.abort());
    await page.goto("/");

    const moodSelector = page.getByTestId("mood-selector");
    await moodSelector.getByText("How are you feeling today?").click();
    await expect(moodSelector.getByText("Motivated")).toBeVisible();

    // chose Motivated mood
    await moodSelector.getByText("Motivated").click();

    // Motivated mood should be selected
    await expect(
      moodSelector.locator("button:has-text('Motivated')")
    ).toBeVisible();

    await moodSelector.locator("button:has-text('Motivated')").click();

    // chose Relaxed mood
    await expect(moodSelector.getByText("Relaxed")).toBeVisible();
    await moodSelector.getByText("Relaxed").click();

    // Relaxed mood should be selected
    await expect(
      moodSelector.locator("button:has-text('Relaxed')")
    ).toBeVisible();
  });
});
