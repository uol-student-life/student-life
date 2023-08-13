import { expect, Page } from "@playwright/test";

export async function fakeDate(page: Page, date = "July 10 2023 13:37:11") {
  const fakeNow = new Date(date).valueOf();

  // https://github.com/microsoft/playwright/issues/6347#issuecomment-1085850728
  await page.addInitScript(`{
    // Extend Date constructor to default to fakeNow
    Date = class extends Date {
      constructor(...args) {
        if (args.length === 0) {
          super(${fakeNow});
        } else {
          super(...args);
        }
      }
    }
      // Override Date.now() to start from fakeNow
      const __DateNowOffset = ${fakeNow} - Date.now();
      const __DateNow = Date.now;
      Date.now = () => __DateNow() + __DateNowOffset;
    }`);
}

interface CreateMilestoneOptions {
  text: string;
}

export async function createMilestone(
  page: Page,
  options: CreateMilestoneOptions
) {
  // create new milestone
  await page.waitForSelector('div[contenteditable="true"]');
  const editor = page.locator('div[contenteditable="true"]');
  await page.focus('div[contenteditable="true"]');
  await page.keyboard.type("Some text ", { delay: 1000 });
  await page.keyboard.type(`#${options.text}`, { delay: 1000 });
  await expect(page.getByTestId("editor-add-milestone")).toBeVisible();
  await page.getByTestId("editor-add-milestone").click();
  await expect(
    editor.locator(
      `[data-testid='editor-milestone']:text-is('${options.text}')`
    )
  ).toBeVisible({ timeout: 2000 });
}
