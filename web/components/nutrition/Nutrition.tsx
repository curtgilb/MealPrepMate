import { useCategorizedNutrients } from "@/hooks/use-categorized-nutrients";
import { SummedNutrients } from "@/utils/nutrients";

interface NutritionProps {
  nutrients: SummedNutrients;
}

export function Nutrition({ nutrients }: NutritionProps) {
  const { categorized, childNutrients } = useCategorizedNutrients(true);
  
if (categorized) {
    categorized.
}

}
