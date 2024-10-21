import "dotenv/config";
import { createBuckets, nukeData, seedDb } from "@/seed/db_init.js";
import { RecipeKeeperTransformer } from "@/application/services/import/transformers/RecipeKeeperTransformer.js";
import { createRecipe } from "@/application/services/recipe/RecipeService.js";

await nukeData();
await createBuckets();
await seedDb();

const recipeKeeper = new RecipeKeeperTransformer();
const recipes = await recipeKeeper.transform({
  type: "local",
  filePath: "/Users/curtgilbert/MealPrepMate/server/data/RecipeKeeper.zip",
});

for (const recipe of recipes) {
  await createRecipe(recipe.getRecipe(true));
}
// /Users/curtgilbert/MealPrepMate/server/data/RecipeKeeper.zip
// C:\\Users\\cgilb\\Desktop\\RecipeKeeper_20241010_135410.zip
