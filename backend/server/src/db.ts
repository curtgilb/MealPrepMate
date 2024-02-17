import { PrismaClient } from "@prisma/client";
import { nutritionExtension } from "./models/NutritionExtension.js";
import { recipeExtensions } from "./models/RecipeExtension.js";
import { photoExtension } from "./models/PhotoExtension.js";
import { RecipeMetaExtension } from "./models/RecipeMetaExtension.js";

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
