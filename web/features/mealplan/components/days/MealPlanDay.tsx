"use client";
import { MealPlan } from "@/contexts/MealPlanContext";
import { Meal } from "@/gql/graphql";
import { toTitleCase } from "@/utils/utils";
import { useContext } from "react";
import { Card } from "../../generics/Card";
import { AddServingDialog } from "../AddServingDialog";
import { useNutrientSum } from "@/hooks/use-nutrient-sum";
import { Nutrients } from "@/hooks/use-recipe-label-lookup";
import { PlanDay, PlanDayProps } from "./DayInterface";
import { MealPlanServingCard } from "../ServingCard";
import { SummedNutrients } from "@/utils/nutrients";
import { cn } from "@/lib/utils";

export const courses: Meal[] = [
  Meal.Breakfast,
  Meal.Lunch,
  Meal.Dinner,
  Meal.Snack,
];

const macros: Array<keyof SummedNutrients> = [
  "calories",
  "protein",
  "carbs",
  "fat",
];

export function MealPlanDay({
  dayNumber,
  displayNumber,
  servingsByMeal,
  isVerticalLayout,
}: PlanDayProps) {
  const mealPlan = useContext(MealPlan);
  const recipes = mealPlan?.recipes;
  const servingsByCourse = servingsByMeal?.get(dayNumber);
  const allServingsForDay = Array.from(
    servingsByMeal?.get(dayNumber)?.values() ?? []
  ).flat();
  const dayTotal = useNutrientSum(
    allServingsForDay,
    mealPlan?.labels ?? new Map<string, Nutrients>()
  );

  return (
    <PlanDay
      isVerticalLayout={isVerticalLayout}
      displayNumber={displayNumber}
      topRight={<AddServingDialog day={dayNumber} />}
    >
      <div className="flex justify-between mb-8">
        <ul
          className={cn("flex justify-between  w-full", {
            "max-w-[20rem]": isVerticalLayout,
            "ms-auto": isVerticalLayout,
          })}
        >
          {macros.map((macro) => {
            return (
              <li className="flex flex-col items-center" key={macro}>
                {/* TODO: get rid of as number */}
                <p className="font-semibold">
                  {Math.round(dayTotal[macro] as number)} g
                </p>
                <p className="text-sm">{toTitleCase(macro)}</p>
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <div
          className={cn(
            "grid gap-4",
            isVerticalLayout ? "grid-cols-2" : "grid-cols-1"
          )}
        >
          {courses.map((course) => {
            const mealServings = servingsByCourse?.get(course);
            return (
              <div key={course}>
                <p className="font-semibold mb-2">{toTitleCase(course)}</p>
                <div className="bg-secondary/50 min-h-48 rounded p-2">
                  {mealServings?.map((serving) => {
                    const matchingRecipe = recipes?.find(
                      (recipe) => recipe.id === serving.mealPlanRecipeId
                    );
                    const recipeLabel = mealPlan?.labels.get(
                      serving.mealPlanRecipeId
                    );
                    const servingCalories = Math.round(
                      (recipeLabel?.calories.perServing ?? 0) *
                        serving.numberOfServings
                    );
                    return (
                      <MealPlanServingCard
                        id={serving.id}
                        meal={serving.meal as Meal}
                        dayNumber={dayNumber}
                        key={serving.id}
                        servings={serving.numberOfServings}
                        calories={servingCalories}
                        name={matchingRecipe?.originalRecipe.name ?? ""}
                        photoUrl={""}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PlanDay>
  );
}
