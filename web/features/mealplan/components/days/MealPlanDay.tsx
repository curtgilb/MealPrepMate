"use client";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  NutrientLabel,
  SummedNutrientLabelArgs,
} from "@/features/mealplan/hooks/useMealPlanNutrition";
import { UseMealPlanRecipesResult } from "@/features/mealplan/hooks/useMealPlanRecipes";
import { PlanServingsByDayResultData } from "@/features/mealplan/hooks/usePlanServings";
import { Meal, MealPlanServingsFieldFragment } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import { toTitleCase } from "@/utils/utils";
import { useMealPlanContext } from "@/features/mealplan/hooks/useMealPlanContext";
import { useNutrientAggregation } from "@/features/mealplan/hooks/useNutrientAggregation";
import { FilledImage } from "@/components/images/FilledImage";

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

type MacroKeys = Exclude<keyof NutrientLabel, "nutrients">;
const macros: MacroKeys[] = ["calories", "fat", "carbs", "protein"];

interface PlanDayProps {
  dayNumber: number;
  isVerticalLayout: boolean;
  servings: PlanServingsByDayResultData | undefined;
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
  console.log("DayNumber", dayNumber);
  console.log(servings);
  const dayOfWeek = DAYS_OF_WEEK[(dayNumber - 1) % 7];
  const { calculateNutrition, day } = useMealPlanContext();
  const { grouped } = useNutrientAggregation({
    servingsByDay: servings?.groupedByDay ?? {},
    calculateNutrition,
  });
  const daysTotalNutrition = grouped[dayNumber - 1];
  const servingsByCourse = servings?.groupedByCourse[dayNumber];

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
                    {Math.round(
                      daysTotalNutrition ? daysTotalNutrition[macro] : 0
                    )}{" "}
                    g
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
                  <ul className="bg-secondary/50 min-h-48 rounded-lg  py-3 px-2.5">
                    {servingsByCourse &&
                      servingsByCourse[course].map((serving) => {
                        const recipe =
                          recipeLookup &&
                          recipeLookup[serving.mealPlanRecipeId];
                        const orginalRecipe = recipe?.originalRecipe;
                        const primaryPhoto =
                          orginalRecipe?.photos.find(
                            (photo) => photo.isPrimary
                          ) ?? orginalRecipe?.photos[0];

                        const photoUrl = primaryPhoto?.url
                          ? process.env.NEXT_PUBLIC_STORAGE_URL +
                            primaryPhoto.url
                          : "/placeholder_recipe.jpg";

                        return (
                          <li
                            key={serving.id}
                            className="group flex gap-3 bg-card border rounded overflow-hidden hover:cursor-pointer"
                            onClick={() => openDialog(dayNumber, serving)}
                          >
                            <FilledImage
                              url={photoUrl}
                              altText={orginalRecipe?.name ?? ""}
                              targetSize="xs"
                              squared
                            ></FilledImage>
                            <div className="grow py-1.5 space-y-1">
                              <p className="text-sm group-hover:underline">
                                {orginalRecipe?.name}
                              </p>
                              <p className="text-xs font-light">
                                {`${serving.numberOfServings} servings`}{" "}
                              </p>
                            </div>
                          </li>
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
