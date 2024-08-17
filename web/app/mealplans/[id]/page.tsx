"use client";
import { MealPlanName } from "@/features/mealplan/components/PlanName";
import { graphql, useFragment } from "@/gql";
import { mealPlanQuery } from "@/graphql/mealplan/mealplan";
import { mealRecipeFragment } from "@/graphql/mealplan/mealrecipes";
import { mealServingsFragment } from "@/graphql/mealplan/mealservings";
import { useRecipeLabelLookup } from "@/hooks/use-recipe-label-lookup";
import { useQuery } from "@urql/next";
import { MealPlan } from "@/contexts/MealPlanContext";
import { useParams } from "next/navigation";
import { Suspense, useState } from "react";
import { MealPlanServings } from "@/contexts/ServingsContext";
import {
  ModeDropdown,
  PlanMode,
} from "@/features/mealplan/components/controls/ModeDropdown";
import { DayScroller } from "@/features/mealplan/components/controls/DayPicker";
import { DayManager } from "@/features/mealplan/components/days/DayManager";
import { MealPlanSideBar } from "@/features/mealplan/components/MealPlanSideBar";

export type DisplayMode = "week" | "day";

export default function MealPlanPage() {
  const params = useParams<{ id: string }>();
  const [mealPlanResult, refetchMealPlan] = useQuery({
    query: mealPlanQuery,
    variables: { mealPlanId: params.id },
  });
  const [display, setDisplay] = useState<DisplayMode>("week");
  const [days, setDays] = useState<number>(1);
  const [mode, setMode] = useState<PlanMode>("meal_planning");

  const { data, fetching, error } = mealPlanResult;
  const labels = useRecipeLabelLookup(data?.mealPlan.planRecipes);
  const recipes = useFragment(mealRecipeFragment, data?.mealPlan.planRecipes);
  const servings = useFragment(
    mealServingsFragment,
    data?.mealPlan.mealPlanServings
  );

  if (!data) return "loading or error";

  return (
    <MealPlan.Provider
      value={{
        labels,
        recipes,
        id: params.id,
      }}
    >
      <MealPlanServings.Provider value={servings}>
        <div className="h-main-full overflow-hidden flex">
          <div className="flex flex-col p-4 grow h-full min-w-0 overflow-hidden">
            <div className="flex justify-between mb-6">
              <MealPlanName
                name={data.mealPlan.name ?? "Untitled meal plan"}
                mealPlanId={params.id}
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
