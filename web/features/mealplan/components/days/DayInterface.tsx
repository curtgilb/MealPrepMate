import { ReactNode } from "react";
import { ServingsLookup } from "./DayManager";
import { cn } from "@/lib/utils";

export interface PlanDayProps {
  dayNumber: number;
  displayNumber: number;
  servingsByMeal: ServingsLookup | null | undefined;
  isVerticalLayout: boolean;
}

interface BasePlanDay {
  displayNumber: number;
  children: ReactNode;
  topRight?: ReactNode;
  isVerticalLayout: boolean;
}

export function PlanDay({
  children,
  topRight,
  displayNumber,
  isVerticalLayout,
}: BasePlanDay) {
  return (
    <div
      className={cn(
        "border rounded-sm p-6 bg-card shadow grid gap-y-4",
        isVerticalLayout ? "w-full" : "w-[28rem]"
      )}
    >
      <div className="flex items-baseline justify-between">
        <p className="text-2xl font-extrabold mb-4">Day {displayNumber}</p>
        {topRight}
      </div>
      <div>{children}</div>
    </div>
  );
}
