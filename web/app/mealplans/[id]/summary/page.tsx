import { StackedBarChart } from "@/components/nutrition/charts/DayStackedMacros";
import { MacroPieChart } from "@/components/nutrition/charts/MacroPieChart";
import { NutritionSummary } from "@/components/nutrition/NutritionSummary";

export default function Summary() {
  return (
    <div className="grid grid-cols-4">
      <StackedBarChart />
      <MacroPieChart protein={40} fat={20} alcohol={0} carbs={40} />
      <NutritionSummary values={{}} />
    </div>
  );
}
