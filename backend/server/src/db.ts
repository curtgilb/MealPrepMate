import { PrismaClient } from "@prisma/client";
import { nutritionExtension } from "./model_extensions/NutritionExtension.js";
import { recipeExtensions } from "./model_extensions/RecipeExtension.js";
import { photoExtension } from "./model_extensions/PhotoExtension.js";
import { RecipeMetaExtension } from "./model_extensions/RecipeMetaExtension.js";

export const db = createDbClient();

export type DbClient = ReturnType<typeof createDbClient>;
export type DbTransactionClient = Parameters<
  Parameters<DbClient["$transaction"]>[0]
>[0];

function createDbClient() {
  return new PrismaClient()
    .$extends(recipeExtensions)
    .$extends(nutritionExtension)
    .$extends(photoExtension)
    .$extends(RecipeMetaExtension);
}
