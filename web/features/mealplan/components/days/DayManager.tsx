import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ViewMode } from "@/features/mealplan/components/controls/DayPicker";
import { MealPlanServingsFieldFragment } from "@/gql/graphql";
import { useIdParam } from "@/hooks/use-id";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useMealPlanRecipes } from "@/hooks/usePlanRecipeLabels";
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
  const isVerticalLayout = useMediaQuery("(768px <= width <= 1440px)");
  const currentDay = Math.ceil(days);
  const daysToRender = view === "week" ? 7 : 1;
  const mealPlanId = useIdParam();
  const labels = useMealPlanRecipes(mealPlanId);

  return (
    <div className="grow w-full h-full">
      <ScrollArea>
        <div
          className={cn(
            "flex w-full h-full gap-6 items-center justify-center",
            isVerticalLayout ? "flex-col" : "flex-row"
          )}
        >
          {[...Array(daysToRender)].map((_, index) => {
            // For week view: calculate day numbers within the week
            // For day view: just use the current day
            const dayNumber =
              view === "week"
                ? Math.floor((currentDay - 1) / 7) * 7 + index + 1
                : currentDay;

            return (
              <MealPlanDay
                isVerticalLayout={isVerticalLayout}
                labels={labels}
                key={dayNumber}
                weekAndDay={dayNumber}
                dayOfWeek={view === "week" ? index + 1 : dayNumber % 7 || 7}
              />
            );
          })}
        </div>
        <ScrollBar orientation={isVerticalLayout ? "vertical" : "horizontal"} />
      </ScrollArea>
    </div>
  );
}

// const servingsByMeal = useMemo(() => {
//   return mealServings?.reduce((acc, cur) => {
//     const day = acc.get(cur.day);
//     if (!day) {
//       acc.set(cur.day, new Map<string, MealPlanServingsFieldFragment[]>());
//     }
//     let servings = acc.get(cur.day)?.get(cur.meal);

//     if (!servings) {
//       acc.get(cur.day)?.set(cur.meal, []);
//     }

//     servings = acc.get(cur.day)?.get(cur.meal);
//     if (servings) {
//       servings.push(cur);
//     }
//     return acc;
//   }, new Map<number, Map<string, MealPlanServingsFieldFragment[]>>());
// }, [mealServings]);
