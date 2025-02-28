import { PrismaClient } from "@prisma/client";
import { ingredientExtension } from "@/infrastructure/repository/extensions/IngredientExtension.js";
import { unitExtension } from "@/infrastructure/repository/extensions/UnitExtension.js";
import { recipeExtension } from "@/infrastructure/repository/extensions/RecipeExtension.js";

// import { nutritionExtension } from "../../domain/extensions/NutritionExtension.js";
// import { recipeExtensions } from "../../domain/extensions/RecipeExtension.js";
// import { photoExtension } from "../../domain/extensions/PhotoExtension.js";
// import { RecipeMetaExtension } from "../../domain/extensions/RecipeMetaExtension.js";
// import { RecipeIngredientExtension } from "../../domain/extensions/RecipeIngredientExtension.js";

function createDbClient() {
  return new PrismaClient()
    .$extends(recipeExtension)
    .$extends(ingredientExtension)
    .$extends(unitExtension);
}

export type DbClient = ReturnType<typeof createDbClient>;
export type DbTransactionClient = Parameters<
  Parameters<DbClient["$transaction"]>[0]
>[0];

export const db = createDbClient();
