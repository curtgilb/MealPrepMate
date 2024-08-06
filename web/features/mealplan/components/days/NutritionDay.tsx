import { NutrientTargetBar } from "@/features/nutrition/components/NutrientTargetBar";
import { PlanDay, PlanDayProps } from "./DayInterface";
import { useFeaturedNutrients } from "@/hooks/use-featured-nutrients";
import {
  Nutrients,
  useRecipeLabelLookup,
} from "@/hooks/use-recipe-label-lookup";
import { MealPlan } from "@/contexts/MealPlanContext";
import { useContext } from "react";
import { useNutrientSum } from "@/hooks/use-nutrient-sum";

export function NutritionDay({
  dayNumber,
  displayNumber,
  servingsByMeal,
}: PlanDayProps) {
  const allServingsForDay = Array.from(
    servingsByMeal?.get(dayNumber)?.values() ?? []
  ).flat();

  const featured = useFeaturedNutrients(true);
  const mealPlan = useContext(MealPlan);
  const summedLabel = useNutrientSum(
    allServingsForDay,
    mealPlan?.labels ?? new Map<string, Nutrients>()
  );
  console.log(mealPlan?.labels);

  return (
    <PlanDay displayNumber={displayNumber}>
      <NutrientTargetBar
        name="Calories"
        symbol="kcal"
        value={summedLabel.calories}
        target={0}
      />

      <p className="text-lg font-semibold mb-2">Macro Nutrients</p>
      <NutrientTargetBar
        name="Carbohydrates"
        symbol="g"
        value={summedLabel.carbs}
        target={0}
      />
      <NutrientTargetBar
        name="Protein"
        symbol="g"
        value={summedLabel.protein}
        target={0}
      />
      <NutrientTargetBar
        name="Fat"
        symbol="g"
        value={summedLabel.fat}
        target={0}
      />
      <NutrientTargetBar
        name="Alcohol"
        symbol="g"
        value={summedLabel.alcohol}
        target={0}
      />

      <p className="text-lg font-semibold mb-2">Highlighted Nutrients</p>
      <div className="flex flex-col gap-5">
        {featured?.map((nutrient) => {
          const target = nutrient.customTarget ?? nutrient.dri?.value;
          const value = summedLabel.nutrients.get(nutrient.id) ?? 0;
          return (
            <NutrientTargetBar
              key={nutrient.id}
              name={nutrient.name}
              symbol={nutrient.unit.symbol ?? ""}
              value={value}
              target={target ?? 0}
            />
          );
        })}
      </div>
    </PlanDay>
  );
}
