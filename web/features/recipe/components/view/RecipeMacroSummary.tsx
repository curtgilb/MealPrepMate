import { HTMLAttributes } from "react";

import { StackedList } from "@/components/StackedList";
import { AggregateLabel, RecipeFieldsFragment } from "@/gql/graphql";

interface RecipeMacroSummaryProps extends HTMLAttributes<HTMLUListElement> {
  nutritionLabel:
    | Pick<
        AggregateLabel,
        "totalCalories" | "carbs" | "fat" | "protein" | "servings"
      >
    | undefined
    | null;
  scaleFactor?: number | undefined;
  servings?: number | undefined;
}

export function RecipeMacroSummary({
  nutritionLabel,
  scaleFactor,
  servings,
  ...listProps
}: RecipeMacroSummaryProps) {
  const finalServings = servings || nutritionLabel?.servings || 1;
  const finalScaleFactor = scaleFactor || 1;
  function getTotal(value: number) {
    return Math.round((value * finalScaleFactor) / finalServings);
  }
  const list = [
    {
      id: "calories",
      top: getTotal(nutritionLabel?.totalCalories ?? 0),
      bottom: "Calories",
    },
    {
      id: "carbs",
      top: `${getTotal(nutritionLabel?.carbs ?? 0)} g`,
      bottom: "Carbs",
    },
    {
      id: "fat",
      top: `${getTotal(nutritionLabel?.fat ?? 0)} g`,
      bottom: "Fat",
    },
    {
      id: "protein",
      top: `${getTotal(nutritionLabel?.protein ?? 0)} g`,
      bottom: "Protein",
    },
  ];

  return <StackedList {...listProps} items={list} />;
}
