// import { uploadImportFile } from "./services/import/ImportService.js";
import {
  LabelMaker,
  NutrientAggregator,
} from "./services/nutrition/NutrientAggregator2.js";
import { deleteAllRecords, deleteBuckets, seedDb } from "./seed/seed.js";
import { db } from "./db.js";
import {
  recipe,
  ingredientGroups,
} from "../data/test_data/ChickenGyroRecipe.js";
import {
  recipe as halalChickenRecipe,
  ingredientGroups as halalIngredientGroups,
} from "../data/test_data/HalalChickenRecipe.js";

// await seedDb();
// await db.recipeIngredientGroup.createMany({ data: ingredientGroups });
const recipe1 = await db.recipe.findFirstOrThrow({});

// await db.recipeIngredientGroup.createMany({ data: halalIngredientGroups });
// await db.recipe.create({ data: halalChickenRecipe });

const aggregator = new NutrientAggregator([recipe1.id]);
await aggregator.aggregateNutrients();
const nutrientMap = aggregator.getNutrientMap([
  { id: recipe1.id, factor: 1.5, totalServings: 9 },
]);

const labelMaker = new LabelMaker();
const label = await labelMaker.createLabel({
  nutrients: nutrientMap,
  servings: {
    servings: 9,
  },
  advanced: true,
});
console.log("done");
