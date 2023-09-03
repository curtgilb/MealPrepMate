export enum CastType {
  NUMBER,
  BOOLEAN,
  STRING,
  AUTO,
}

function cast(
  value: unknown,
  targetType = CastType.AUTO,
  defaultValue: unknown = null
): unknown {
  if (value === undefined || value === null) {
    return defaultValue;
  }
  const str = String(value).trim();
  if (value === "") {
    return defaultValue;
  }
  const isNumber = isNumeric(str);
  if (targetType === CastType.NUMBER || isNumber) {
    // If the target type is number, but the value is not numeric, attempt to parse the value as a number by grabbing the first numeric value in the string
    if (!isNumber && targetType === CastType.NUMBER) {
      const matches = str.match(/-?\d+(\.\d+)?/);
      if (matches) {
        return toNumber(matches[0]);
      }
      return defaultValue;
    }
    return toNumber(str);
  } else if (targetType === CastType.BOOLEAN || isBoolean(str)) {
    return toBoolean(str);
  } else if (targetType === CastType.STRING) {
    return str;
  } else {
    return str;
  }
}

function isBoolean(str: string) {
  const lowercaseStr = str.toLowerCase();
  return ["true", "false", "1", "0"].includes(lowercaseStr);
}

function isNumeric(str: string) {
  // Remove leading plus sign or minus sign
  const sanitizedStr = str.replace(/^[+-]/, "");

  // Check if the remaining string is numeric
  if (!/^\d*\.?\d*(e[+-]?\d+)?$/.test(sanitizedStr)) {
    return false;
  }

  // Attempt to parse the string as a number
  const parsedNumber = parseFloat(str);
  return !isNaN(parsedNumber) && isFinite(parsedNumber);
}

function toNumber(value: string): number | undefined {
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

function toBoolean(value: string): boolean {
  if (value.toLowerCase() === "true" || value === "1") {
    return true;
  } else if (value.toLowerCase() === "false" || value === "0") {
    return false;
  } else {
    throw new Error(`Unable to convert ${value} to a boolean`);
  }
}

export { cast, toNumber, toBoolean };
