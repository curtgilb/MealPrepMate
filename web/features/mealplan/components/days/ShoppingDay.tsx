import { PlanDay, PlanDayProps } from "./DayInterface";

export function ShoppingDay({
  dayNumber,
  displayNumber,
  servingsByMeal,
}: PlanDayProps) {
  return (
    <PlanDay displayNumber={displayNumber}>
      <p>Shopping Day</p>
    </PlanDay>
  );
}
