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

const stringArray = z
  .string()
  .transform((value) => value.split(",").map((value) => value.trim()))
  .pipe(z.string().array());

export { cleanedStringSchema, nullableString, stringArray };
