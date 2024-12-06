function generateWeekdayArrays(maxWeeks: number) {
  // Initialize arrays for each day of the week (Monday through Sunday)
  const weekdays = Array(7).fill([]);

  // Calculate total number of days
  const totalDays = maxWeeks * 7;

  // Iterate through each day
  for (let day = 1; day <= totalDays; day++) {
    // Calculate which day of the week it is (0-6, where 0 is Monday)
    // We subtract 1 from day since day is 1-indexed
    const weekdayIndex = (day - 1) % 7;

    // Add the day number to the appropriate weekday array
    weekdays[weekdayIndex].push(day);
  }

  return weekdays;
}

console.log();
