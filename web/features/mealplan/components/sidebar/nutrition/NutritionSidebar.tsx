import { useMemo, useState } from "react";

import { CalorieBalanceContainer } from "@/features/mealplan/components/sidebar/nutrition/chart_containers/CalorieBalanceContainer";
import { CalorieDistibution } from "@/features/mealplan/components/sidebar/nutrition/chart_containers/CalorieDistributionContainer";
import { useMealPlanContext } from "@/features/mealplan/hooks/useMealPlanContext";
import { useNutrientAggregation } from "@/features/mealplan/hooks/useNutrientAggregation";
import { useNutrientTargets } from "@/features/mealplan/hooks/useNutrientTargets";
import { usePlanServings } from "@/features/mealplan/hooks/usePlanServings";
import { getMinMaxDay } from "@/features/mealplan/utils/getMinMaxDay";
import { getWeekNumber } from "@/features/mealplan/utils/getWeekNumber";
import { MacroChart } from "@/features/nutrition/components/target/MacroChart";
import { useIdParam } from "@/hooks/use-id";
import { NutrientChartContainer } from "@/features/mealplan/components/sidebar/nutrition/chart_containers/NutrientChartContainer";
import { Checkbox } from "@/components/ui/checkbox";
import {
  SideBarContainer,
  SideBarContent,
  SideBarHeader,
} from "@/features/mealplan/components/sidebar/SideBarContainer";
import { Separator } from "@/components/ui/separator";
import { MacroChartContainer } from "@/features/mealplan/components/sidebar/nutrition/chart_containers/MacroChartContainer";

export function NutritionSidebar() {
  const mealPlanId = useIdParam();
  const [isCumulative, setCumulative] = useState<boolean>(false);
  const { calculateNutrition, day } = useMealPlanContext();

  const weekBounds = useMemo(() => {
    if (typeof day === "number") {
      const { startOfWeek, endOfWeek } = getMinMaxDay(day);
      return { minDay: startOfWeek, maxDay: endOfWeek };
    }
    return day;
  }, [day]);
  const weekNumber = getWeekNumber(weekBounds.minDay);

  const { groupedByDay } = usePlanServings(
    isCumulative
      ? { mealPlanId, day: undefined }
      : { mealPlanId, day: weekBounds }
  );

  const targets = useNutrientTargets();
  const { combined, grouped } = useNutrientAggregation({
    servingsByDay: groupedByDay,
    calculateNutrition,
  });

  return (
    <SideBarContainer>
      <SideBarHeader>
        <h3 className="">
          {isCumulative ? `All weeks` : `Week ${weekNumber}`}
        </h3>
      </SideBarHeader>
      <SideBarContent>
        <div className="space-y-14">
          <CalorieDistibution
            numOfWeeks={weekNumber}
            nutrients={grouped}
            calorieTarget={targets?.calories}
          />

          {targets?.calories && (
            <CalorieBalanceContainer
              numOfWeeks={weekNumber}
              nutrients={grouped}
              calorieTarget={targets?.calories}
            />
          )}
          <MacroChartContainer
            numOfWeeks={weekNumber}
            nutrients={combined}
            targets={targets?.nutrients}
          />

          <NutrientChartContainer
            numOfWeeks={weekNumber}
            nutrients={grouped}
            targets={targets?.nutrients}
          />
        </div>
      </SideBarContent>
    </SideBarContainer>
  );
}
