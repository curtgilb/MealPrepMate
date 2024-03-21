import {
  FullNutritionLabel,
  NutrientMapArgs,
} from "../nutrition/NutritionAggregator.js";
import {
  LabelMaker,
  NutrientAggregator,
} from "../../services/nutrition/NutritionAggregator.js";

async function getAggregatedLabel(
  recipes: NutrientMapArgs[], // Recipe ID
  advanced: boolean,
  groupByLabel: boolean
): Promise<FullNutritionLabel> {
  const aggregator = new NutrientAggregator();
  await aggregator.addLabels(
    recipes.map((recipe) => recipe.id),
    groupByLabel
  );

  const nutrients = aggregator.getNutrientMap(recipes);
  const servingInfo =
    recipes.length === 1
      ? {
          ...aggregator.getServingInfo(recipes[0].id),
          ...recipes[0]?.scale,
        }
      : {};
  const labelMaker = new LabelMaker();
  return labelMaker.createLabel({ nutrients, servings: servingInfo, advanced });
}

export { getAggregatedLabel };
