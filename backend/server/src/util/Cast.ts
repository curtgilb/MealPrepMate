import {
  Gender,
  SpecialCondition,
  DayOfWeek,
  NutrientType,
} from "@prisma/client";

enum CastType {
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

function toNutrientTypeEnum(value: string): NutrientType {
  let nutrientType = cast(value) as string;
  if (nutrientType) {
    nutrientType = nutrientType.toUpperCase();
    if (["MINERAL", "MINERALS"].includes(nutrientType)) return "MINERAL";
    else if (["VITAMIN", "VITAMINS"].includes(nutrientType)) return "VITAMIN";
    else if (["FAT", "FATS", "LIPID"].includes(nutrientType)) return "FAT";
    else if (["PROTEIN", "PROTEINS"].includes(nutrientType)) return "PROTEIN";
    else if (["CARBS", "CARBOHYDRATES", "CARBOHYDRATE"].includes(nutrientType))
      return "CARBOHYDRATE";
    else if (nutrientType === "ALCOHOL") return "ALCHOHOL";
  }
  return "OTHER";
}

function toGenderEnum(value: string): Gender {
  let gender = cast(value) as string;
  if (gender) {
    gender = gender.toUpperCase();
    if (["M", "MALE"].includes(gender)) return "MALE";
    else if (["F", "FEMALE"].includes(gender)) return "FEMALE";
  }
  throw new Error(`Unable to convert ${value} to a gender`);
}

function toSpecialConditionEnum(value: string): SpecialCondition {
  let specialCondition = cast(value) as string;
  if (specialCondition) {
    specialCondition = specialCondition.toUpperCase();
    if (["PREGNANT"].includes(specialCondition)) return "PREGNANT";
    else if (["LACTATING"].includes(specialCondition)) return "LACTATING";
  }
  return "NONE";
}

function toDayOfWeekEnum(value: string): DayOfWeek {
  let dayOfWeek = cast(value) as string;
  if (dayOfWeek) {
    dayOfWeek = dayOfWeek.toUpperCase();
    if (["MONDAY", "MON"].includes(dayOfWeek)) return "MONDAY";
    else if (["TUESDAY", "TUES"].includes(dayOfWeek)) return "TUESDAY";
    else if (["WEDNESDAY", "WED"].includes(dayOfWeek)) return "WEDNESDAY";
    else if (["THURSDAY", "THURS"].includes(dayOfWeek)) return "THURSDAY";
    else if (["FRIDAY", "FRI"].includes(dayOfWeek)) return "FRIDAY";
    else if (["SATURDAY", "SAT"].includes(dayOfWeek)) return "SATURDAY";
    else if (["SUNDAY", "SUN"].includes(dayOfWeek)) return "SUNDAY";
  }
  throw new Error(`Unable to convert ${value} to a day of week`);
}

export {
  cast,
  toNumber,
  toBoolean,
  toNutrientTypeEnum,
  toGenderEnum,
  toSpecialConditionEnum,
  toDayOfWeekEnum,
};
