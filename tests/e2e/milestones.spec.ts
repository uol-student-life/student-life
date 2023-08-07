import { test, expect } from "@playwright/test";
import { resetDB } from "../helpers/reset-db";
import { fakeDate, createMilestone } from "../e2e-utils";

test.afterAll(async () => {
  await resetDB();
});

test.describe("Milestones", () => {
  test("can create/edit/remove", async ({ page }) => {
    await fakeDate(page);
    await page.route(/unsplash/, (route) => route.abort());
    await page.goto("/");

    // can create new milestone
    await createMilestone(page, { text: "milestone" });
    // new milestone should be visible in Milestones section
    const milestonesSection = page.getByTestId("milestone-progress-section");
    await expect(milestonesSection.getByText("milestone")).toBeVisible();

    // can update milestone
    await page.getByTestId("milestone-item").hover();
    await page.getByTitle("Edit milestone").click();
    const form = page.getByTestId("milestone-form");
    await form.locator("input").fill("Milestone edited");
    await form.locator("button").click();
    // milestone should update in milestones section
    await expect(milestonesSection.getByText("Milestone edited")).toBeVisible();

    // milestone should update in editor too
    const editor = page.locator('div[contenteditable="true"]');
    await expect(editor.getByText("Milestone edited")).toBeVisible();

    // can remove milestone
    await page.getByTestId("milestone-item").hover();
    await page.getByTitle("Remove milestone").click();
    await page.getByText("Yes, delete milestone").click();

    // milestone should be removed from milestones section
    await expect(milestonesSection.getByText("Milestone edited")).toBeHidden();

    // milestone should be removed from editor
    await expect(editor.getByText("Milestone edited")).toBeHidden();
  });

  test("can change status to complete", async ({ page }) => {
    await fakeDate(page);
    await page.route(/unsplash/, (route) => route.abort());
    await page.goto("/");

    // can create new milestone
    await createMilestone(page, { text: "milestone" });
    // new milestone should be visible in Milestones section
    const milestonesProgressSection = page.getByTestId(
      "milestone-progress-section"
    );
    await expect(
      milestonesProgressSection.getByText("milestone")
    ).toBeVisible();

    // can update milestone
    await page.getByTestId("milestone-item").hover();
    await page.getByTitle("Change milestone status").click();
    const form = page.getByTestId("milestone-status-form");
    await form.locator("select").selectOption("COMPLETED");
    await form.locator("button").click();

    // milestone should move to Completed section
    const milestonesCompletedSection = page.getByTestId(
      "milestone-completed-section"
    );
    await expect(
      milestonesCompletedSection.getByText("milestone")
    ).toBeVisible();
    await expect(milestonesProgressSection.getByText("milestone")).toBeHidden();
  });
});
