import { FullNutritionLabel } from "../nutrition/NutritionAggregator.js";
import {
  LabelMaker,
  NutrientAggregator,
  NutrientMap,
} from "../../services/nutrition/NutritionAggregator.js";
async function getAggregatedLabel(
  recipeId: string,
  advanced: boolean
): Promise<FullNutritionLabel> {
  const aggregator = new NutrientAggregator();
  await aggregator.addLabels([recipeId]);
  const nutrients = aggregator.getNutrientMap([{ id: recipeId }]);
  const servings = aggregator.getServingInfo(recipeId);
  const labelMaker = new LabelMaker();
  return labelMaker.createLabel({ nutrients, servings, advanced });
}

export { getAggregatedLabel };
