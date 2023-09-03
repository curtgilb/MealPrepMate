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

export { toTitleCase, toCamelCase };

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
