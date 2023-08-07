import { test, expect } from "@playwright/test";
import { resetDB } from "../helpers/reset-db";
import { fakeDate, createMilestone } from "../e2e-utils";

test.afterAll(async () => {
  await resetDB();
});

test.describe("Tasks", () => {
  test("can create/edit/remove", async ({ page }) => {
    await fakeDate(page);
    await page.goto("/");

    const milestoneName = "milestone";
    // can create new milestone
    await createMilestone(page, { text: milestoneName });
    // new milestone should be visible in Milestones section
    const milestonesSection = page.getByTestId("milestone-progress-section");
    await expect(milestonesSection.getByText(milestoneName)).toBeVisible();

    // create new task
    await page.focus('div[contenteditable="true"]');
    await page.keyboard.press("Enter");
    await page.keyboard.type(" #task", { delay: 1000 });
    await expect(page.getByTestId("editor-add-task")).toBeVisible();
    await page.getByTestId("editor-add-task").click();

    const taskForm = page.getByTestId("task-form");
    await taskForm.locator("select").selectOption({ label: milestoneName });
    await taskForm.locator("textarea").fill("New task");
    await page.getByRole("button", { name: "Add task" }).click();

    // task should be visible in Tasks section
    await expect(page.getByRole("button", { name: "milestone" })).toBeVisible();
    await page.getByRole("button", { name: "milestone" }).click();
    const task = page.getByTestId("tasks-list").getByTestId("task");
    await expect(task).toBeVisible();
    await expect(task.getByText("New task")).toBeVisible();

    // task should be visible in editor
    const editor = page.locator('div[contenteditable="true"]');
    await expect(editor.getByTestId("task")).toBeVisible();

    // edit task
    await task.hover();
    await page.getByTitle("Edit task").click();
    await taskForm.locator("textarea").fill("Edited task");
    await page.getByRole("button", { name: "Update task" }).click();
    await expect(task.getByText("Edited task")).toBeVisible();
    await expect(
      editor.getByTestId("task").getByText("Edited task")
    ).toBeVisible();

    // remove task
    await task.hover();
    await page.getByTitle("Remove task").click();
    await page.getByText("Yes, delete task").click();
    await expect(task.getByText("Edited task")).toBeHidden();
    await expect(
      editor.getByTestId("task").getByText("Edited task")
    ).toBeHidden();
  });
});
