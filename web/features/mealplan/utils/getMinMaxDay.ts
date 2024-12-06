export function getMinMaxDay(day: number) {
  // Calculate the day index (0 = Sunday, 6 = Saturday)
  const dayIndex = (day - 1) % 7;

  // Calculate the start and end of the week
  const startOfWeek = day - dayIndex;
  const endOfWeek = day + (6 - dayIndex);

  // Calculate the week number (1-based)
  const weekNumber = Math.ceil(startOfWeek / 7);

  return { startOfWeek, endOfWeek, weekNumber, dayIndex };
}
