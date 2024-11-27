"use client";
import { useState } from "react";

import { mealPlanQuery } from "@/features/mealplan/api/MealPlan";
import {
  DayScroller,
  ViewMode,
} from "@/features/mealplan/components/controls/DayPicker";
import {
  ModeDropdown,
  PlanMode,
} from "@/features/mealplan/components/controls/ModeDropdown";
import { DayManager } from "@/features/mealplan/components/days/DayManager";
import { MealPlanSideBar } from "@/features/mealplan/components/MealPlanSideBar";
import { useIdParam } from "@/hooks/use-id";
import { useQuery } from "@urql/next";

export type DisplayMode = "week" | "day";

export default function MealPlanPage() {
  const mealPlanId = useIdParam();
  const [mealPlanResult] = useQuery({
    query: mealPlanQuery,
    variables: { mealPlanId },
  });

  const [view, setView] = useState<ViewMode>("week");
  const [days, setDays] = useState<number>(1);
  const [mode, setMode] = useState<PlanMode>("meal_planning");

  const { data, fetching, error } = mealPlanResult;

  if (!data) return "loading or error";

  return (
    <div className="h-main-full overflow-hidden flex bg-muted">
      {/* Main Content */}
      <div className="p-4 px-12 grow h-full overflow-hidden">
        <div className=" w-full max-w-sc mx-auto">
          {/* Top Bar */}
          <div className="flex justify-between mb-6">
            <h1 className="text-2xl font-bold font-serif">
              {data.mealPlan.name}
            </h1>
            <DayScroller
              value={days}
              onChange={setDays}
              view={view}
              setView={setView}
            />
            <ModeDropdown mode={mode} setMode={setMode} />
          </div>

          {/* Day Planner */}
          <DayManager days={days} view={view} />
        </div>
      </div>

      {/* Sidebar */}
      <div className="shrink-0">
        <MealPlanSideBar />
      </div>
    </div>
  );
}
