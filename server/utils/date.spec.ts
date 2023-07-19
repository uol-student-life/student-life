import { describe, test, expect } from "vitest";
import { stripTime } from "./date";

describe("stripTime", () => {
  test("returns date without time", () => {
    const expectedDate = new Date("2023-07-19T00:00:00.000Z");
    const strippedDate = stripTime(new Date("2023-07-19T12:34:56"));

    expect(strippedDate).toEqual(expectedDate);
  });

  test("returns date even though input is not valid Date type", () => {
    const expectedDate = new Date("2023-07-19T00:00:00.000Z");
    // @ts-ignore
    const strippedDate = stripTime("2023-07-19" as string);

    expect(strippedDate).toEqual(expectedDate);
  });

  test("returns the same date if already without time", () => {
    const dateWithoutTime = new Date("2023-07-19T00:00:00.000Z");
    const strippedDate = stripTime(dateWithoutTime);

    expect(strippedDate).toEqual(dateWithoutTime);
  });
});
