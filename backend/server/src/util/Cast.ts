function toNumber(value: string): number | undefined {
  const parsedFloat = parseFloat(value);
  const parsedInt = parseInt(value, 10);

  if (!isNaN(parsedFloat)) {
    return parsedFloat;
  } else if (!isNaN(parsedInt)) {
    return parsedInt;
  } else {
    throw new Error(`Unable to convert ${value} to a number`);
  }
}

function toBoolean(value: string): boolean {
  if (value.toLowerCase() === "true" || value === "1") {
    return true;
  } else if (value.toLowerCase() === "false" || value === "0") {
    return false;
  } else {
    throw new Error(`Unable to convert ${value} to a boolean`);
  }
}

export { toNumber, toBoolean };
