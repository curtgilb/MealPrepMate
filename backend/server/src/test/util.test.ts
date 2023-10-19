import { toTitleCase, toCamelCase, getFileExtension } from "../util/utils.js";
import { expect, test } from "vitest";

test("toTitleCase", () => {
  expect(toTitleCase("hELlo woRLd")).toBe("Hello World");
});

test("toCamelCase", () => {
  expect(toCamelCase("HeLLo wORLD")).toBe("helloWorld");
});
