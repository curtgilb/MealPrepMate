import { StackedList } from "@/components/StackedList";
import { RecipeFieldsFragment } from "@/gql/graphql";

interface RecipeNutritionSummaryProps {
  nutritionLabel: RecipeFieldsFragment["aggregateLabel"] | undefined;
  scaleFactor?: number | undefined;
  servings?: number | undefined;
}

export function RecipeNutritionSummary({
  nutritionLabel,
  scaleFactor,
  servings,
}: RecipeNutritionSummaryProps) {
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
  const calories = nutritionLabel?.totalCalories ?? 0;
  const carbs = nutritionLabel?.carbs ?? 0;
  const fat = nutritionLabel?.fat ?? 0;
  const protein = nutritionLabel?.protein ?? 0;

  return <StackedList items={list} />;
}
