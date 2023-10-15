import { getFieldDef } from "graphql/execution/execute.js";

function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

function toCamelCase(input: string): string {
  return input
    .toLowerCase()
    .replace(/[-_\s](.)/g, (_, char: string) => char.toUpperCase())
    .replace(/[-_\s]/g, "");
}

// function vulgarFractionToDecimal(text: string): string {
//   const vulgarFractionMap = {
//     "¼": "1/4",
//     "½": "1/2",
//     "¾": "3/4",
//     // Add more mappings as needed
//   };

//   const regex = new RegExp(Object.keys(vulgarFractionMap).join("|"), "g");

//   const replacedText = text.replace(regex, (match) => vulgarFractionMap[match]);

//   return replacedText;
// }

// https://github.com/aceakash/string-similarity/blob/master/src/index.js
function compareTwoStrings(first: string, second: string): number {
  first = first.replace(/\s+/g, "");
  second = second.replace(/\s+/g, "");

  if (first === second) return 1; // identical or empty
  if (first.length < 2 || second.length < 2) return 0; // if either is a 0-letter or 1-letter string

  const firstBigrams = new Map<string, number>();
  for (let i = 0; i < first.length - 1; i++) {
    const bigram = first.substring(i, i + 2);
    const count = firstBigrams.has(bigram)
      ? (firstBigrams.get(bigram) as number) + 1
      : 1;

    firstBigrams.set(bigram, count);
  }

  let intersectionSize = 0;
  for (let i = 0; i < second.length - 1; i++) {
    const bigram = second.substring(i, i + 2);
    const count = (
      firstBigrams.has(bigram) ? firstBigrams.get(bigram) : 0
    ) as number;

    if (count > 0) {
      firstBigrams.set(bigram, count - 1);
      intersectionSize++;
    }
  }

  return (2.0 * intersectionSize) / (first.length + second.length - 2);
}

function getFileExtension(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf(".");
  return fileName.substring(lastDotIndex + 1);
}

export { toTitleCase, toCamelCase, compareTwoStrings, getFileExtension };
