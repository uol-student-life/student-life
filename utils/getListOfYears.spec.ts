import { describe, test, expect } from "vitest";
import { getListOfYears } from "./getListOfYears";

describe("getListOfYears", () => {
  test("returns a list of years from the startYear to the current year", () => {
    const years = getListOfYears({ startYear: 2018 });
    const currentYear = new Date().getFullYear();
    const expectedYears = Array.from(
      { length: currentYear - 2018 + 1 },
      (_, index) => (2018 + index).toString()
    );
    expect(years).toEqual(expectedYears.reverse());
  });

  test("returns a list of years starting from the default startYear (2020)", () => {
    const years = getListOfYears();
    const currentYear = new Date().getFullYear();
    const expectedYears = Array.from(
      { length: currentYear - 2020 + 1 },
      (_, index) => (2020 + index).toString()
    );
    expect(years).toEqual(expectedYears.reverse());
  });
});
