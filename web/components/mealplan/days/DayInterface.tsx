import { ReactNode } from "react";
import { ServingsLookup } from "./DayManager";

export interface PlanDayProps {
  dayNumber: number;
  displayNumber: number;
  servingsByMeal: ServingsLookup | null | undefined;
}

interface BasePlanDay {
  displayNumber: number;
  children: ReactNode;
  topRight?: ReactNode;
}

export function PlanDay({ children, topRight, displayNumber }: BasePlanDay) {
  return (
    <div className="border rounded-sm p-6 w-96 bg-card shadow grid gap-y-4">
      <div className="flex items-baseline justify-between">
        <p className="text-2xl font-extrabold mb-4">Day {displayNumber}</p>
        {topRight}
      </div>
      <div>{children}</div>
    </div>
  );
}
