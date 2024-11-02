function extractNumbers(str: string) {
  if (typeof str !== "string") {
    throw new Error("Input must be a string");
  }

  // Regular expression to match different number formats:
  // 1. Mixed fractions: -?\d+\s+\d+\/\d+
  // 2. Regular fractions: -?\d+\/\d+
  // 3. Decimal numbers or integers: -?\d*\.?\d+
  const numberPattern = /(-?\d+\s+\d+\/\d+|-?\d+\/\d+|-?\d*\.?\d+)/g;

  // Return all matches or empty array if none found
  return str.match(numberPattern) || [];
}

// Check for common fraction approximations
function findCommonFraction(decimal: number) {
  // Common fraction approximations with their decimal ranges
  const commonFractions = [
    { range: [0.32, 0.34], fraction: { numerator: 1, denominator: 3 } },
    { range: [0.66, 0.67], fraction: { numerator: 2, denominator: 3 } },
    { range: [0.165, 0.167], fraction: { numerator: 1, denominator: 6 } },
    { range: [0.832, 0.834], fraction: { numerator: 5, denominator: 6 } },
    { range: [0.124, 0.126], fraction: { numerator: 1, denominator: 8 } },
    { range: [0.374, 0.376], fraction: { numerator: 3, denominator: 8 } },
    { range: [0.624, 0.626], fraction: { numerator: 5, denominator: 8 } },
    { range: [0.874, 0.876], fraction: { numerator: 7, denominator: 8 } },
    { range: [0.199, 0.201], fraction: { numerator: 1, denominator: 5 } },
    { range: [0.399, 0.401], fraction: { numerator: 2, denominator: 5 } },
    { range: [0.599, 0.601], fraction: { numerator: 3, denominator: 5 } },
    { range: [0.799, 0.801], fraction: { numerator: 4, denominator: 5 } },
  ];

  for (const pattern of commonFractions) {
    if (decimal >= pattern.range[0] && decimal <= pattern.range[1]) {
      return pattern.fraction;
    }
  }

  // Exact fraction matches with proper type handling
  const exactFractions: {
    [key: string]: {
      numerator: number;
      denominator: number;
    };
  } = {
    "0.25": { numerator: 1, denominator: 4 },
    "0.5": { numerator: 1, denominator: 2 },
    "0.75": { numerator: 3, denominator: 4 },
    "0.2": { numerator: 1, denominator: 5 },
    "0.4": { numerator: 2, denominator: 5 },
    "0.6": { numerator: 3, denominator: 5 },
    "0.8": { numerator: 4, denominator: 5 },
  };

  const key = decimal.toString();
  return exactFractions[key] || null;
}

// Simplify fraction
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function decimalToFraction(decimal: number) {
  // For remaining decimals, use basic fraction conversion
  const precision = 1e-10;
  let denominator = 1;
  while (
    Math.abs(Math.round(decimal * denominator) / denominator - decimal) >
    precision
  ) {
    denominator *= 10;
  }
  return {
    numerator: Math.round(decimal * denominator),
    denominator: denominator,
  };
}

function numberToFractionString(num: number) {
  if (typeof num !== "number" || isNaN(num)) {
    throw new Error("Input must be a valid number");
  }

  // Handle special cases
  if (Number.isInteger(num)) {
    return num.toString();
  }

  // Handle negative numbers
  const isNegative = num < 0;
  num = Math.abs(num);

  // Get whole number part for mixed fractions
  const wholeNumber = Math.floor(num);
  const decimal = num - wholeNumber;

  // If decimal part is 0, return just the whole number
  if (decimal === 0) {
    return isNegative ? `-${wholeNumber}` : wholeNumber.toString();
  }

  // Get fraction for decimal part
  const fraction = findCommonFraction(decimal) || decimalToFraction(decimal);

  let { numerator, denominator } = fraction;
  const divisor = gcd(numerator, denominator);
  numerator = numerator / divisor;
  denominator = denominator / divisor;

  // Construct the string result
  let result = "";
  if (isNegative) {
    result += "-";
  }
  if (wholeNumber !== 0) {
    result += `${wholeNumber} `;
  }
  result += `${numerator}/${denominator}`;

  return result;
}

function stringToNumber(str) {
  // Remove whitespace and validate input
  if (!str || typeof str !== "string") {
    throw new Error("Invalid input: must be a non-empty string");
  }

  str = str.trim();

  // Check if it's a simple decimal number
  if (!isNaN(str)) {
    return Number(str);
  }

  // Handle negative numbers
  const isNegative = str.startsWith("-");
  if (isNegative) {
    str = str.slice(1);
  }

  // Check for mixed fraction format (e.g., "1 2/3")
  const parts = str.split(" ");

  if (parts.length > 2) {
    throw new Error("Invalid format: too many spaces");
  }

  let result = 0;

  // Process whole number part if it exists
  if (parts.length === 2) {
    if (isNaN(parts[0])) {
      throw new Error("Invalid whole number part");
    }
    result = Number(parts[0]);
  }

  // Process fraction part
  const fractionPart = parts[parts.length === 2 ? 1 : 0];

  if (fractionPart.includes("/")) {
    const [numerator, denominator] = fractionPart.split("/");

    if (isNaN(numerator) || isNaN(denominator) || Number(denominator) === 0) {
      throw new Error("Invalid fraction format");
    }

    result += Number(numerator) / Number(denominator);
  } else if (!isNaN(fractionPart)) {
    result = Number(fractionPart);
  } else {
    throw new Error("Invalid number format");
  }

  return isNegative ? -result : result;
}

// Test cases focusing on thirds and other common fractions
const tests = [
  { input: 1 / 3, expected: "1/3" },
  { input: 2 / 3, expected: "2/3" },
  { input: 4 / 3, expected: "1 1/3" },
  { input: 5 / 3, expected: "1 2/3" },
  { input: -1 / 3, expected: "-1/3" },
  { input: -2 / 3, expected: "-2/3" },
  { input: 1.5, expected: "1 1/2" },
  { input: -1.75, expected: "-1 3/4" },
  { input: 2.25, expected: "2 1/4" },
  { input: -0.5, expected: "-1/2" },
  { input: 3, expected: "3" },
  { input: 0.125, expected: "1/8" },
  { input: 0.375, expected: "3/8" },
  { input: 0.166666666666667, expected: "1/6" },
  { input: 0.833333333333333, expected: "5/6" },
];

console.log(numberToFractionString(0.33));
