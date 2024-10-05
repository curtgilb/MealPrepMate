import { PrismaClient } from "@prisma/client";
import { ingredientExtension } from "@/infrastructure/repository/extensions/Ingredient.js";
import { measurementUnit } from "@/graphql/schemas/common/MeasurementUnitSchema.js";
// import { nutritionExtension } from "../../domain/extensions/NutritionExtension.js";
// import { recipeExtensions } from "../../domain/extensions/RecipeExtension.js";
// import { photoExtension } from "../../domain/extensions/PhotoExtension.js";
// import { RecipeMetaExtension } from "../../domain/extensions/RecipeMetaExtension.js";
// import { RecipeIngredientExtension } from "../../domain/extensions/RecipeIngredientExtension.js";

export const db = createDbClient();

export type DbClient = ReturnType<typeof createDbClient>;
export type DbTransactionClient = Parameters<
  Parameters<DbClient["$transaction"]>[0]
>[0];

function createDbClient() {
  return new PrismaClient()
    .$extends(ingredientExtension)
    .$extends(measurementUnit);
  // .$extends(recipeExtensions)
  // .$extends(RecipeIngredientExtension)
  // .$extends(nutritionExtension)
  // .$extends(photoExtension)
  // .$extends(RecipeMetaExtension);
}
