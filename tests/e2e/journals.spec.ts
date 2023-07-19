import { test, expect } from "@playwright/test";
import { resetDB } from "../helpers/reset-db";

test.afterAll(async () => {
  await resetDB();
});

test.describe("Journals", () => {
  test("can create/update/delete journal", async ({ page }) => {
    await fakeDate(page);
    await page.goto("/");
    await expect(page.getByText("Save")).toBeVisible();

    // can create new journal
    await createJournal(page, { text: "New journal" });
    // new journal should be visible in Journals section
    const journalsSection = page.getByTestId("journals");
    await expect(journalsSection.getByText("New journal")).toBeVisible();

    // can update journal
    await page.focus('div[contenteditable="true"]');
    await page.keyboard.type(" Updated");
    await page.getByText("Save").click();
    await expect(
      journalsSection.getByText("New journal Updated")
    ).toBeVisible();

    // can delete journal
    await page.getByText("Delete").click();
    await page.getByText("Yes, delete journal").click();
    await expect(journalsSection.getByText("New journal Updated")).toBeHidden();
  });

  test("current journal date should be visible", async ({ page }) => {
    await fakeDate(page);
    await page.goto("/");
    await expect(
      await page.getByTestId("current-journal-date").textContent()
    ).toBe("10th July 2023");
  });

  test("selected month should be visible", async ({ page }) => {
    await fakeDate(page);
    await page.goto("/");
    await expect(await page.getByTestId("current-month").textContent()).toBe(
      "July, 2023"
    );
  });

  test("can create few journals and select them in calendar", async ({
    page,
  }) => {
    await page.goto("/");

    // go to calendar
    await page.getByTestId("calendar-view-tab").click();

    // create new journal on 11th july
    await page.locator("[data-test-day-button]:text-is('11')").click();
    await fakeDate(page, "July 11 2023 13:37:11");
    await createJournal(page, { text: "New journal 11th" });
    await expect(
      page.locator(
        "[data-test-day-button]:text-is('11') [data-testid='has-journal']"
      )
    ).toBeVisible();

    // create new journal on 12th july
    await page.locator("[data-test-day-button]:text-is('12')").click();
    await fakeDate(page, "July 12 2023 13:37:11");
    await createJournal(page, { text: "New journal 12th" });
    await expect(
      page.locator(
        "[data-test-day-button]:text-is('12') [data-testid='has-journal']"
      )
    ).toBeVisible();

    // can select journal from calendar
    await page.locator("[data-test-day-button]:text-is('11')").click();
    await expect(
      await page.getByTestId("current-journal-date").textContent()
    ).toBe("11th July 2023");
  });
});

async function createJournal(page, { text }) {
  // create new journal
  await page.focus('div[contenteditable="true"]');
  await page.keyboard.type(text);
  await page.getByText("Save").click();
}

async function fakeDate(page, date = "July 10 2023 13:37:11") {
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
