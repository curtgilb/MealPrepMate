"use client";
import { MealPlanName } from "@/components/ingredient/PlanName";
import { DayScroller } from "@/components/mealplan/controls/DayPicker";
import {
  ModeDropdown,
  PlanMode,
} from "@/components/mealplan/controls/ModeDropdown";

import { DayManager } from "@/components/mealplan/days/DayManager";
import { MealPlanSideBar } from "@/components/mealplan/MealPlanSideBar";
import { graphql, useFragment } from "@/gql";
import { mealPlanQuery } from "@/graphql/mealplan/mealplan";
import { mealRecipeFragment } from "@/graphql/mealplan/mealrecipes";
import { mealServingsFragment } from "@/graphql/mealplan/mealservings";
import { useRecipeLabelLookup } from "@/hooks/use-recipe-label-lookup";
import { useQuery } from "@urql/next";
import { MealPlan } from "@/contexts/MealPlanContext";
import { useParams } from "next/navigation";
import { useState } from "react";
import { MealPlanServings } from "@/contexts/ServingsContext";

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
  console.log(data);

  return (
    <MealPlan.Provider
      value={{
        labels,
        recipes,
        id: params.id,
      }}
    >
      <MealPlanServings.Provider value={servings}>
        <div className="flex">
          <div className="p-4 grow">
            <div className="flex justify-between mb-8">
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
            <DayManager />
          </div>

          <MealPlanSideBar />
        </div>
      </MealPlanServings.Provider>
    </MealPlan.Provider>
  );
}
