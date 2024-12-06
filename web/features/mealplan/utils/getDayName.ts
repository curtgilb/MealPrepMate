const ABBREV_NAMES = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
const FULL_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function getDayName(day: number, type: "abbrev" | "full") {
  // Calculate the day index (0 = Sunday, 6 = Saturday)
  const dayIndex = (day - 1) % 7;
  return type === "abbrev" ? ABBREV_NAMES[dayIndex] : FULL_NAMES[dayIndex];
}
