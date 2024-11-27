import {
  getServingsQuery,
  mealServingsFragment,
} from "@/features/mealplan/api/MealPlanServings";
import { getFragmentData } from "@/gql";
import { useQuery } from "@urql/next";

interface PlanServingsByDayProps {
  mealPlanId: string;
  day: number | { minDay: number; maxDay: number };
}

export function usePlanServingsByDay(mealPlanId: string, day: number) {
  const [result] = useQuery({
    query: getServingsQuery,
    variables: { mealPlanId },
  });

  const servings = getFragmentData(
    mealServingsFragment,
    result.data?.mealPlanServings
  );

  servings?.map((serving) => {
    serving.meal;
  });
}
