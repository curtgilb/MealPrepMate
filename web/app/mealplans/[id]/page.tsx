"use client";
import { useParams } from "next/navigation";
import { Suspense, useState } from "react";

import { MealPlan } from "@/contexts/MealPlanContext";
import { MealPlanServings } from "@/contexts/ServingsContext";
import { mealPlanQuery } from "@/features/mealplan/api/MealPlan";
import { mealPlanRecipeFragment } from "@/features/mealplan/api/MealPlanRecipe";
import { DayScroller } from "@/features/mealplan/components/controls/DayPicker";
import {
  ModeDropdown,
  PlanMode,
} from "@/features/mealplan/components/controls/ModeDropdown";
import { DayManager } from "@/features/mealplan/components/days/DayManager";
import { MealPlanSideBar } from "@/features/mealplan/components/MealPlanSideBar";
import { MealPlanName } from "@/features/mealplan/components/PlanName";
import { getFragmentData, graphql } from "@/gql";
import { mealServingsFragment } from "@/graphql/mealplan/mealservings";
import { useRecipeLabelLookup } from "@/hooks/use-recipe-label-lookup";
import { useQuery } from "@urql/next";

export type DisplayMode = "week" | "day";

export default function MealPlanPage() {
  const params = useParams<{ id: string }>();
  const mealPlanId = decodeURIComponent(params.id);
  const [mealPlanResult, refetchMealPlan] = useQuery({
    query: mealPlanQuery,
    variables: { mealPlanId: decodeURIComponent(mealPlanId) },
  });
  const [display, setDisplay] = useState<DisplayMode>("week");
  const [days, setDays] = useState<number>(1);
  const [mode, setMode] = useState<PlanMode>("meal_planning");

  const { data, fetching, error } = mealPlanResult;
  const labels = useRecipeLabelLookup(data?.mealPlan.planRecipes);
  const recipes = getFragmentData(
    mealPlanRecipeFragment,
    data?.mealPlan.planRecipes
  );
  const servings = getFragmentData(
    mealServingsFragment,
    data?.mealPlan.mealPlanServings
  );

  if (!data) return "loading or error";

  return (
    <MealPlan.Provider
      value={{
        labels,
        recipes,
        id: mealPlanId,
      }}
    >
      <MealPlanServings.Provider value={servings}>
        <div className="h-main-full overflow-hidden flex">
          <div className="flex flex-col p-4 grow h-full min-w-0 overflow-hidden">
            <div className="flex justify-between mb-6">
              <MealPlanName
                name={data.mealPlan.name ?? "Untitled meal plan"}
                mealPlanId={mealPlanId}
              />
              <DayScroller
                value={days}
                onChange={setDays}
                canScrollDays={true}
              />
              <ModeDropdown mode={mode} setMode={setMode} />
            </div>
            <DayManager days={days} display="week" planMode={mode} />
          </div>
          <MealPlanSideBar />
        </div>
      </MealPlanServings.Provider>
    </MealPlan.Provider>
  );
}
