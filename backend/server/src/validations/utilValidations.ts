import { z } from "zod";

function cleanedStringSchema(max: number, formatter?: (val: string) => string) {
  return z
    .string()
    .transform((value) => {
      let cleanedString = value.trim().replace(/\s\s+/g, " ");
      if (formatter) cleanedString = formatter(cleanedString);
      return cleanedString;
    })
    .pipe(z.string().min(1).max(max));
}

const nullableString = z.preprocess(
  (v) => (v === "" ? null : v),
  z.string().trim().min(1).nullish()
);

function coerceNumeric(value: unknown) {
  if (!value) return undefined;
  if (typeof value === "number" || typeof value === "bigint") return value;
  const matches = String(value).match(/-?\d+(\.\d+)?/);
  if (matches) {
    return toNumber(matches[0]);
  }
}

function toNumber(value: string): number {
  const parsedFloat = parseFloat(value);
  const parsedInt = parseInt(value, 10);

  if (!isNaN(parsedFloat)) {
    return parsedFloat;
  } else if (!isNaN(parsedInt)) {
    return parsedInt;
  } else {
    return 0;
  }
}

const stringArray = z
  .string()
  .transform((value) => value.split(",").map((value) => value.trim()))
  .pipe(z.string().array())
  .optional();

export { cleanedStringSchema, nullableString, stringArray, coerceNumeric };
