"use client";
import { MealPlan } from "@/contexts/MealPlanContext";
import { Meal } from "@/gql/graphql";
import { toTitleCase } from "@/utils/utils";
import { useContext } from "react";
import { Card } from "../../generics/Card";
import { AddServingDialog } from "../AddServingDialog";
import { useNutrientSum } from "@/hooks/use-nutrient-sum";
import { Nutrients } from "@/hooks/use-recipe-label-lookup";
import { PlanDayProps } from "./DayInterface";
import { MealPlanServingCard } from "../ServingCard";

export const courses: Meal[] = [
  Meal.Breakfast,
  Meal.Lunch,
  Meal.Dinner,
  Meal.Snack,
];

export function MealPlanDay({
  dayNumber,
  displayNumber,
  servingsByMeal,
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
    <div className="border rounded-sm p-6 w-96 bg-card shadow grid gap-y-4">
      <div className="flex items-baseline justify-between">
        <p className="text-2xl font-extrabold mb-4">Day {displayNumber}</p>
        <p className="text-xl font-semibold mb-4">
          {Math.round(dayTotal.calories)} calories
        </p>
      </div>
      <AddServingDialog day={dayNumber} />
      <div>
        <div className="grid grid-cols-1">
          {courses.map((course) => {
            const mealServings = servingsByCourse?.get(course);
            return (
              <div key={course}>
                <p className="text-lg font-bold mb-2">{toTitleCase(course)}</p>
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
    </div>
  );
}
