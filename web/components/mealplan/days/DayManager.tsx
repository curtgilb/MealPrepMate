import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { MealPlan } from "@/contexts/MealPlanContext";
import { MealPlanServingsFieldFragment } from "@/gql/graphql";
import { useNutrients } from "@/hooks/use-nutrients";
import { Component, ReactNode, useContext, useMemo } from "react";
import { MealPlanDay } from "./MealPlanDay";
import { PlanMode } from "../controls/ModeDropdown";
import { PlanDay } from "./DayInterface";
import { DisplayMode } from "@/app/mealplans/[id]/page";

const courses = ["Breakfast", "Lunch", "Dinner", "Snacks"];

// Aggregate days by day, then by course
interface DayManagerProps {
  days: number;
  display: DisplayMode;
}

export type ServingsLookup = Map<
  number,
  Map<string, MealPlanServingsFieldFragment[]>
>;

export function DayManager({ days }: DayManagerProps) {
  const { categorized, childNutrients, featured } = useNutrients(true);
  const week = Math.ceil(days / 7);
  const mealPlan = useContext(MealPlan);
  const servings = mealPlan?.servings;
  const servingsByMeal = useMemo(() => {
    return servings?.reduce((acc, cur) => {
      const day = acc.get(cur.day);
      if (!day) {
        acc.set(cur.day, new Map<string, MealPlanServingsFieldFragment[]>());
      }
      let servings = acc.get(cur.day)?.get(cur.meal);

      if (!servings) {
        acc.get(cur.day)?.set(cur.meal, []);
      }

      servings = acc.get(cur.day)?.get(cur.meal);
      if (servings) {
        servings.push(cur);
      }

      return acc;
    }, new Map<number, Map<string, MealPlanServingsFieldFragment[]>>());
  }, [servings]);

  const dayComponent: Record<PlanMode, React.FC<PlanDay>> = {
    meal_planning: MealPlanDay,
  };

  return (
    <ScrollArea className="w-full">
      <div className="flex flex-row w-full gap-6">
        {[...Array(7)].map((item, index) => {
          const displayNumber = index + 1;
          const dayNumber = (week - 1) * 7 + displayNumber;
          return (
            <MealPlanDay
              key={dayNumber}
              dayNumber={dayNumber}
              displayNumber={displayNumber}
              servingsByMeal={servingsByMeal}
            />
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
