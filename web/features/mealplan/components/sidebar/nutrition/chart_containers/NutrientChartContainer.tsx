import { useMemo, useState } from "react";

import {
  AbbreviatedDay,
  WeekCalorieChart,
} from "@/features/mealplan/components/sidebar/nutrition/charts/CalorieDistributionChart";
import { NutrientLabel } from "@/features/mealplan/hooks/useMealPlanNutrition";
import { getDayName } from "@/features/mealplan/utils/getDayName";
import {
  NutrientTargetFieldsFragment,
  SearchNutrientsQuery,
} from "@/gql/graphql";
import { GenericCombobox } from "@/components/combobox/GenericCombox1";
import { getNutrientsForPicker } from "@/features/nutrition/api/Nutrient";
import { NutrientChart } from "@/features/mealplan/components/sidebar/nutrition/charts/NutrientChart";
import { NutrientTargetsResult } from "@/features/mealplan/hooks/useNutrientTargets";

interface CalorieDistributionProps {
  numOfWeeks: number;
  nutrients: (NutrientLabel | undefined)[];
  targets: NutrientTargetsResult["nutrients"];
}

type SelectedNutrient = SearchNutrientsQuery["nutrients"][number] & {
  label: string;
};

export function NutrientChartContainer({
  numOfWeeks,
  nutrients,
  targets,
}: CalorieDistributionProps) {
  const [selectedNutrient, setNutrient] = useState<
    SelectedNutrient | undefined
  >(undefined);

  const total = useMemo(() => {
    return nutrients.reduce((total, day) => {
      const todaysValue = selectedNutrient?.id
        ? day?.nutrients.get(selectedNutrient?.id)
        : 0;
      return total + (todaysValue ?? 0);
    }, 0);
  }, [nutrients, selectedNutrient]);

  const days = useMemo(() => {
    return nutrients.map((day, i) => ({
      day: getDayName(i + 1, "abbrev") as AbbreviatedDay,
      nutrientValue:
        day?.nutrients && selectedNutrient?.id
          ? day.nutrients.get(selectedNutrient.id) ?? 0
          : 0,
    }));
  }, [nutrients, selectedNutrient]);

  const nutrientTarget =
    targets && selectedNutrient && selectedNutrient.id in targets
      ? targets[selectedNutrient.id]
      : undefined;

  return (
    <figure className="flex gap-3 flex-col">
      <figcaption className="flex justify-between">
        <p className="font-bold text-lg font-serif ">Custom Nutrient</p>
      </figcaption>
      <div className="flex gap-8">
        <GenericCombobox
          query={getNutrientsForPicker}
          variables={{}}
          renderItem={(item: SearchNutrientsQuery["nutrients"][number]) => {
            return {
              ...item,
              label: `${item.name} ${
                item.unit.symbol ? `(${item.unit.symbol})` : ""
              }`,
            };
          }}
          unwrapDataList={(list) => list?.nutrients ?? []}
          placeholder="Select nutrient"
          autoFilter={true}
          multiSelect={false}
          selectedItems={selectedNutrient ? [selectedNutrient] : []}
          onChange={(items) => {
            if (items.length > 0) {
              setNutrient(items[0]);
            } else {
              setNutrient(undefined);
            }
          }}
        />
        <div className="min-w-20">
          <p className="font-bold text-right">
            {Math.round(total / (7 * numOfWeeks))}{" "}
            {selectedNutrient?.unit.symbol}
          </p>
          <p className="font-extralight text-xs text-right">Daily Avg</p>
        </div>
      </div>

      <NutrientChart
        data={days}
        target={nutrientTarget?.target}
        dri={nutrientTarget?.dri}
        unit={selectedNutrient?.unit.symbol}
      />
    </figure>
  );
}
