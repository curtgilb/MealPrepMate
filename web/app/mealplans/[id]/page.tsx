"use client";
import { useMemo, useState } from "react";

import { mealPlanQuery } from "@/features/mealplan/api/MealPlan";
import {
  DayScroller,
  ViewMode,
} from "@/features/mealplan/components/controls/DayPicker";
import { DayManager } from "@/features/mealplan/components/days/DayManager";
import { MealPlanSideBar } from "@/features/mealplan/components/sidebar/MealPlanSideBar";
import { MealPlanContext } from "@/features/mealplan/contexts/MealPlanContext";
import { useMealPlanNutrition } from "@/features/mealplan/hooks/useMealPlanNutrition";
import { getMinMaxDay } from "@/features/mealplan/utils/getMinMaxDay";
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
  const { calculateNutrition } = useMealPlanNutrition(mealPlanId);
  const [focusedDay, setFocusedDay] = useState<number>(1);

  const dayRange = useMemo(() => {
    if (view === "day") {
      return focusedDay;
    }
    const { startOfWeek, endOfWeek } = getMinMaxDay(focusedDay);

    return { minDay: startOfWeek, maxDay: endOfWeek };
  }, [focusedDay, view]);

  const { data, fetching, error } = mealPlanResult;

  if (!data) return "loading or error";

  return (
    <MealPlanContext.Provider value={{ day: dayRange, calculateNutrition }}>
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
                value={focusedDay}
                onChange={setFocusedDay}
                view={view}
                setView={setView}
              />
            </div>

            {/* Day Planner */}
            <DayManager days={focusedDay} view={view} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="shrink-0">
          <MealPlanSideBar />
        </div>
      </div>
    </MealPlanContext.Provider>
  );
}
