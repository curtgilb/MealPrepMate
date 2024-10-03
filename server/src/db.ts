import { PrismaClient } from "@prisma/client";
import { nutritionExtension } from "./models/NutritionExtension.js";
import { recipeExtensions } from "./models/RecipeExtension.js";
import { photoExtension } from "./models/PhotoExtension.js";
import { RecipeMetaExtension } from "./models/RecipeMetaExtension.js";
import { RecipeIngredientExtension } from "./models/RecipeIngredientExtension.js";

export const db = createDbClient();

export type DbClient = ReturnType<typeof createDbClient>;
export type DbTransactionClient = Parameters<
  Parameters<DbClient["$transaction"]>[0]
>[0];

function createDbClient() {
  return new PrismaClient()
    .$extends(recipeExtensions)
    .$extends(RecipeIngredientExtension)
    .$extends(nutritionExtension)
    .$extends(photoExtension)
    .$extends(RecipeMetaExtension);
}
