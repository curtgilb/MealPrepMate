import { toString } from "@/application/util/TypeCast.js";
import { z } from "zod";

function cleanString(value: unknown) {
  const inputStr = toString(value).trim().replace(/\s\s+/g, " ");
  if (!inputStr) return undefined;
  return inputStr;
}

const stringToBoolean = z
  .enum(["TRUE", "FALSE"])
  .transform((value) => value.toUpperCase() === "TRUE");

function toStringList(val: unknown) {
  const inputStr = toString(val).trim().replace(/\s\s+/g, " ");
  if (!inputStr) return undefined;
  return inputStr.split(",").map((value) => value.trim());
}

// const nullableString = z.preprocess(
//   (v) => (v === "" ? null : v),
//   z.string().trim().min(1).nullish()
// );

// function coerceNumeric(value: unknown) {
//   if (!value) return undefined;
//   if (typeof value === "number" || typeof value === "bigint") return value;
//   const matches = String(value).match(/-?\d+(\.\d+)?/);
//   if (matches) {
//     return toNumber(matches[0]);
//   }
// }

// function toNumber(value: string): number {
//   const parsedFloat = parseFloat(value);
//   const parsedInt = parseInt(value, 10);

//   if (!isNaN(parsedFloat)) {
//     return parsedFloat;
//   } else if (!isNaN(parsedInt)) {
//     return parsedInt;
//   } else {
//     return 0;
//   }
// }

// const stringArray = z
//   .nullable(z.string())
//   .transform((value) => {
//     if (!value) return [];
//     return value.split(",").map((value) => value.trim());
//   })
//   .pipe(z.string().array());

export { cleanString, toStringList };
