"use client";
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    NutrientLabel, SummedNutrientLabelArgs
} from '@/features/mealplan/hooks/useMealPlanNutrition';
import { UseMealPlanRecipesResult } from '@/features/mealplan/hooks/useMealPlanRecipes';
import { PlanServingsByDayResultData } from '@/features/mealplan/hooks/usePlanServings';
import { Meal, MealPlanServingsFieldFragment } from '@/gql/graphql';
import { cn } from '@/lib/utils';
import { toTitleCase } from '@/utils/utils';

export const courses: Meal[] = [
  Meal.Breakfast,
  Meal.Lunch,
  Meal.Dinner,
  Meal.Snack,
];

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const macros: Array<keyof NutrientLabel> = [
  "calories",
  "protein",
  "carbs",
  "fat",
];

interface PlanDayProps {
  dayNumber: number;
  isVerticalLayout: boolean;
  servings: PlanServingsByDayResultData["groupedByCourse"] | undefined;
  recipeLookup: UseMealPlanRecipesResult | undefined;
  openDialog: (
    day: number,
    serving: MealPlanServingsFieldFragment | null
  ) => void;
}

export function MealPlanDay({
  dayNumber,
  isVerticalLayout,
  servings,
  recipeLookup,
  openDialog,
}: PlanDayProps) {
  const dayOfWeek = DAYS_OF_WEEK[(dayNumber - 1) % 7];

  return (
    <div
      className={cn(
        "border rounded-md p-6 bg-card shadow grid gap-y-4",
        isVerticalLayout ? "w-[28rem]" : "w-full"
      )}
    >
      <div className="flex items-baseline justify-between">
        <p className="text-2xl  font-serif font-medium mb-4">{dayOfWeek}</p>
        <Button
          variant="secondary"
          onClick={() => {
            openDialog(dayNumber, null);
          }}
        >
          <Plus /> Add serving
        </Button>
      </div>
      <div>
        <div className="flex justify-between mb-8">
          <ul
            className={cn("flex justify-between  w-full", {
              "max-w-[20rem] ms-auto": !isVerticalLayout,
            })}
          >
            {macros.map((macro) => {
              return (
                <li className="flex flex-col items-center" key={macro}>
                  {/* TODO: get rid of as number */}
                  <p className="font-semibold">
                    {/* {Math.round(dayTotal[macro] as number)} g */}
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
              isVerticalLayout ? "grid-cols-1" : "grid-cols-2"
            )}
          >
            {courses.map((course) => {
              return (
                <div key={course}>
                  <p className="font-semibold mb-2">{toTitleCase(course)}</p>
                  <ul className="bg-secondary/50 min-h-48 rounded p-2">
                    {servings &&
                      dayNumber in servings &&
                      servings[dayNumber][course].map((serving) => {
                        return (
                          <li key={serving.id}>{serving.numberOfServings}</li>
                        );
                      })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
