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
