function toNumber(x: unknown): number {
  switch (typeof x) {
    case "number":
      return x;
    case "string":
      const parsedFloat = parseFloat(x);
      const parsedInt = parseInt(x, 10);

      if (!isNaN(parsedFloat)) {
        return parsedFloat;
      } else if (!isNaN(parsedInt)) {
        return parsedInt;
      } else {
        return 0;
      }
    case "undefined":
      return 0;
    case "boolean":
      return +x;
    default:
      throw new Error(`Error trying to cast ${typeof x} to number`);
  }
}

function toBool(x: unknown): boolean {
  return !!x;
}

function toString(x: unknown): string {
  if (typeof x === "string") {
    return x; // Already a string, return as is
  }
  if (x === null || x === undefined) {
    return ""; // Convert `null` and `undefined` to empty string
  }
  return String(x); // Convert other types to string using `String()` constructor
}

export { toNumber, toBool, toString };
