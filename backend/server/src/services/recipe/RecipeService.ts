import {
  FullNutritionLabel,
  ServingInfo,
} from "../nutrition/NutritionAggregator.js";
import {
  LabelMaker,
  NutrientAggregator,
  NutrientMap,
} from "../../services/nutrition/NutritionAggregator.js";

async function getAggregatedLabel(
  id: string,
  advanced: boolean,
  groupByLabel: boolean
): Promise<FullNutritionLabel> {
  const aggregator = new NutrientAggregator();
  await aggregator.addLabels([id], groupByLabel);
  const nutrients = aggregator.getNutrientMap([{ id: id }]);
  const servings = aggregator.getServingInfo(id);
  const labelMaker = new LabelMaker();
  return labelMaker.createLabel({ nutrients, servings, advanced });
}

export { getAggregatedLabel };
