import { describe, test, expect } from "vitest";
import { stripHtml } from "./html";

describe("stripHtml", () => {
  // Sample texts obtained from:
  // Lorem Ipsum. Lorem Ipsum - All the facts - Lipsum generator. (n.d.). https://www.lipsum.com/
  test("returns string without html", () => {
    const expectedString =
      "What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
    const strippedString = stripHtml(
      `<h1 class="editor-heading-h1" dir="ltr"><span>What is Lorem Ipsum? </span></h1><p class="editor-paragraph" dir="ltr"><span>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></p><p class="editor-paragraph"><br></p>`
    );

    expect(strippedString).toEqual(expectedString);
  });

  test("returns the same string if already without html", () => {
    const stringWithoutHtml = "This is a string without html";
    const strippedString = stripHtml(stringWithoutHtml);

    expect(strippedString).toEqual(stringWithoutHtml);
  });
});
