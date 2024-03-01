// import { uploadImportFile } from "./services/import/ImportService.js";
import { NutrientAggregator } from "./services/nutrition/NutrientAggregator2.js";
import { deleteAllRecords, deleteBuckets, seedDb } from "./seed/seed.js";
import { db } from "./db.js";
// await uploadImportFile({
//   file: "../../../data/test_data/RecipeKeeper_1_test.zip",
//   type: "RECIPE_KEEPER",
// });

const recipe = await db.recipe.findFirstOrThrow({});
const aggregator = new NutrientAggregator([recipe.id]);
await aggregator.aggregateNutrients();
const nutrientMap = aggregator.getNutrientMap([{ id: recipe.id }]);
console.log("done");
