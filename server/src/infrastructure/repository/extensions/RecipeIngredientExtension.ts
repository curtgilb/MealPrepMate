import { Prisma, RecipeIngredient } from "@prisma/client";
import {
  matchIngredients,
  tagIngredients,
} from "@/domain/extensions/IngredientParser.js";
import { IngredientMatcher } from "@/domain/extensions/IngredientMatcher.js";
import { UnitSearch } from "@/features/search/UnitSearch.js";
import { IngredientSearch } from "@/features/search/IngredientSearch.js";

export const RecipeIngredientExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    model: {
      recipeIngredient: {
        async addIngredient(
          text: string,
          recipeId: string
        ): Promise<RecipeIngredient[]> {
          const allUnits = new UnitSearch();
          const allIngredients = new IngredientSearch();
          const ingredients = await tagIngredients(text);
          const matchedIngredients = await matchIngredients(
            ingredients,
            new IngredientMatcher(allUnits, allIngredients)
          );

          return await client.recipeIngredient.createManyAndReturn({
            data: matchedIngredients.map((ingredient) => ({
              sentence: ingredient.sentence,
              quantity: ingredient.quantity,
              name: ingredient.name,
              order: 0,
              recipeId: recipeId,
              measurementUnitId: ingredient.unitId,
              ingredientId: ingredient.ingredientId,
            })),
          });
        },
      },
    },
  });
});
