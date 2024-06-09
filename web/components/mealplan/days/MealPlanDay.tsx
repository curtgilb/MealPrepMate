"use client";
import { graphql } from "@/gql";
import AnimatedNumbers from "react-animated-numbers";
import MacroDistribution from "../MacroDistribution";
import NutrientBar from "../NutrientBar";
import { Button } from "../../ui/button";
import { AddServingDialog } from "../AddServingDialog";
import { Meal } from "@/gql/graphql";
import { toTitleCase } from "@/utils/utils";
import { Card } from "../../generics/Card";
import { useContext } from "react";
import { MealPlan } from "@/contexts/MealPlanContext";
import { Nutrients, useNutrientSum } from "@/hooks/use-recipe-label-lookup";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlanDay } from "./DayInterface";

const courses: Meal[] = [Meal.Breakfast, Meal.Lunch, Meal.Dinner, Meal.Snack];

export function MealPlanDay({
  dayNumber,
  displayNumber,
  servingsByMeal,
}: PlanDay) {
  const mealPlan = useContext(MealPlan);
  const recipes = mealPlan?.recipes;
  const servingsByCourse = servingsByMeal?.get(dayNumber);
  const allServings = mealPlan?.servings?.filter(
    (serving) => serving.day === dayNumber
  );
  const dayTotal = useNutrientSum(
    allServings ?? [],
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
                      <Card
                        key={serving.id}
                        urls={[]}
                        altText="test"
                        vertical={false}
                      >
                        <p className="line-clamp-1 text-sm font-medium">
                          {matchingRecipe?.originalRecipe.name}
                        </p>
                        <p className="font-light text-sm">{`${serving.numberOfServings} servings`}</p>
                        <p className="font-light text-sm">{`${servingCalories} calories`}</p>
                      </Card>
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
