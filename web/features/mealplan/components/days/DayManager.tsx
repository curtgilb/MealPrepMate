"use client";
import { useMemo, useState } from "react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ViewMode } from "@/features/mealplan/components/controls/DayPicker";
import { MealPlanServingDialog } from "@/features/mealplan/components/servings/MealPlanServingDialog";
import { ServingsContext } from "@/features/mealplan/contexts/ServingsContext";
import { useMealPlanContext } from "@/features/mealplan/hooks/useMealPlanContext";
import { useMealPlanRecipes } from "@/features/mealplan/hooks/useMealPlanRecipes";
import { usePlanServings } from "@/features/mealplan/hooks/usePlanServings";
import { MealPlanServingsFieldFragment } from "@/gql/graphql";
import { useIdParam } from "@/hooks/use-id";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

import { MealPlanDay } from "./MealPlanDay";

const courses = ["Breakfast", "Lunch", "Dinner", "Snacks"];

// Aggregate days by day, then by course
interface DayManagerProps {
  days: number;
  view: ViewMode;
}

export type ServingsLookup = Map<
  number, // Day
  Map<string, MealPlanServingsFieldFragment[]> //Course, servings
>;

export function DayManager({ days, view }: DayManagerProps) {
  const mealPlanId = useIdParam();
  const { day, calculateNutrition } = useMealPlanContext();

  // Serving Dialog
  const [selectedServing, setServing] = useState<{
    day: number;
    serving: MealPlanServingsFieldFragment | null;
  } | null>(null);

  const [openDialog, setDialogStatus] = useState<boolean>(false);

  // Day card configuration and orientation

  const singleDay = typeof day === "number";
  const isXlScreen = useMediaQuery("(min-width: 1440px)");
  const isMobile = useMediaQuery("(max-width: 768px)");

  const isVerticalLayout = useMemo(
    () => isMobile || (isXlScreen && !singleDay),
    [isMobile, isXlScreen, singleDay]
  );

  const daysToRender = useMemo(() => {
    if (typeof day === "number") return [day];
    return Array.from({ length: 7 }, (_, i) => day.minDay + i);
  }, [day]);

  // Recipe and servings data
  // Lookup for serving provided the day range.
  const servings = usePlanServings({ mealPlanId, day });

  // Returns basic info about recipes on the plan.
  const recipes = useMealPlanRecipes(mealPlanId);

  return (
    <div className="grow w-full h-full">
      <ScrollArea>
        <div
          className={cn(
            "flex w-full h-full gap-6 items-center justify-center",
            isVerticalLayout ? "flex-row" : "flex-col"
          )}
        >
          {daysToRender.map((dayNumber) => {
            return (
              <MealPlanDay
                isVerticalLayout={isVerticalLayout}
                servings={servings}
                key={dayNumber}
                dayNumber={dayNumber}
                recipeLookup={recipes}
                openDialog={(day, serving) => {
                  setServing({ day, serving });
                  setDialogStatus(true);
                }}
              />
            );
          })}
        </div>
        <ScrollBar orientation={isVerticalLayout ? "horizontal" : "vertical"} />
      </ScrollArea>
      <ServingsContext.Provider
        value={{
          selectedDay: selectedServing?.day ?? 0,
          allRecipes: Object.values(recipes ?? {}),
        }}
      >
        <MealPlanServingDialog
          serving={selectedServing?.serving}
          isOpen={openDialog}
          setOpen={setDialogStatus}
        />
      </ServingsContext.Provider>
    </div>
  );
}
