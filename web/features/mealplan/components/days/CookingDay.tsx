import { PlanDay, PlanDayProps } from "./DayInterface";

export function CookingDay({
  dayNumber,
  displayNumber,
  servingsByMeal,
}: PlanDayProps) {
  return (
    <PlanDay displayNumber={displayNumber}>
      <p>Cooking Day</p>
    </PlanDay>
  );
}
