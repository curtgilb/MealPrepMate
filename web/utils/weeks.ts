export function getWeekNumber(dayNumber: number) {
  const week = Math.ceil(dayNumber / 7);
  return week;
}
export function getDisplayDayNumber(dayNumber: number) {
  const remainder = dayNumber % 7;
  return remainder == 0 ? 7 : remainder;
}

// export function getDayDisplayNumber(dayNumber: number) {
//   return Math.ceil(dayNumber / 7);
// }
// export function getDayNumber(week: number, displayNumber: number) {}
// export function getMinMaxDayNumbers(week: number) {}
