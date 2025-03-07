import "dotenv/config";

import { RecipeKeeperTransformer } from "@/application/services/import/transformers/RecipeKeeperTransformer.js";
import { createRecipe } from "@/application/services/recipe/RecipeService.js";
import { createBuckets, nukeData, seedDb } from "@/seed/db_init.js";
import { db } from "@/infrastructure/repository/db.js";
import { createPriceHistory } from "@/application/services/ingredient/IngredientPriceService.js";
import { generateFakeIngredientPriceHistory } from "@/seed/seeders/IngredientPrice.js";

await nukeData();
await createBuckets();
await seedDb();

const recipeKeeper = new RecipeKeeperTransformer();
const recipes = await recipeKeeper.transform({
  type: "local",
  filePath: "C:\\Users\\cgilb\\Desktop\\RecipeKeeper_20241010_135410.zip",
});

for (const recipe of recipes) {
  const final_recipe = recipe.getRecipe(true);

  if (final_recipe.source?.startsWith("http") && final_recipe.nutrition) {
    await createRecipe(final_recipe);
  }
}

const ingredients = await db.ingredient.findMany();

for (const ingredient of ingredients) {
  const prices = generateFakeIngredientPriceHistory(ingredient.id);
  await createPriceHistory(prices);
}

// /Users/curtgilbert/MealPrepMate/server/data/RecipeKeeper.zip
// C:\\Users\\cgilb\\Desktop\\RecipeKeeper_20241010_135410.zip

// const test = { title: undefined, numbers: -2 };

// const recipeInputValidation = z.object({
//   title: z
//     .string()
//     .nullish()
//     .transform((val) => val ?? ""),
//   numbers: z
//     .number()
//     .nonnegative()
//     .nullish()
//     .transform((val) => val ?? 0),
// });

// const result = recipeInputValidation.parse(test);

// console.log(result);
