import { Prisma, Recipe, RecipeIngredient } from "@prisma/client";
import {
  CreateNutritionLabelInput,
  RecipeIngredientUpdateInput,
  RecipeInput,
} from "../types/gql.js";
import { createNutritionLabelStmt } from "./NutritionExtension.js";
import { tagIngredients } from "./IngredientTagger.js";
import { IngredientMatcher } from "./IngredientMatcher.js";
import {
  buildRecipeIngredientNestedCreateMany,
  buildRecipeIngredientStmt,
  buildRecipeStmt,
} from "./RecipeStmtBuilder.js";

type RecipeQuery = {
  include?: Prisma.RecipeInclude | undefined;
  select?: Prisma.RecipeSelect | undefined;
};

type RecipeIngredientQuery = {
  include?: Prisma.RecipeIngredientInclude | undefined;
  select?: Prisma.RecipeIngredientSelect | undefined;
};

async function createRecipeCreateStmt(input: {
  recipe: RecipeInput;
  nutritionLabel?: CreateNutritionLabelInput;
  matchingRecipeId?: string;
  ingredientMatcher: IngredientMatcher;
  update: boolean;
  verifed: boolean;
}) {
  // Create ingredient stmt
  const ingredients = await createRecipeIngredientsStmt({
    ingredientTxt: input.recipe.ingredients,
    ingredientMatcher: input.ingredientMatcher,
    matchingRecipeId: input.matchingRecipeId,
  });

  // Create nutrition label stmt
  const nutritionLabel = input.nutritionLabel
    ? createNutritionLabelStmt(input.nutritionLabel, true, input.verifed)
    : undefined;

  // Create final statement
  return buildRecipeStmt(
    {
      recipe: input.recipe,
      verifed: input.verifed,
      ingredients,
      nutritionLabel,
    },
    false
  );
}

type RecipeIngredientInput = {
  ingredientTxt: string | undefined | null;
  ingredientMatcher: IngredientMatcher;
  matchingRecipeId?: string;
};

async function createRecipeIngredientsStmt(
  input: RecipeIngredientInput | undefined
): Promise<
  Prisma.RecipeIngredientCreateNestedManyWithoutRecipeInput | undefined
> {
  if (!input || !input.ingredientTxt) {
    return undefined;
  }
  const { ingredientTxt, ingredientMatcher, matchingRecipeId } = input;
  const taggedIngredients = await tagIngredients(
    ingredientTxt,
    ingredientMatcher,
    matchingRecipeId
  );
  return buildRecipeIngredientNestedCreateMany(taggedIngredients);
}

export const recipeExtensions = Prisma.defineExtension((client) => {
  return client.$extends({
    model: {
      recipe: {
        async createRecipe(recipe: RecipeInput, query?: RecipeQuery) {
          const matcher = new IngredientMatcher();
          return await client.recipe.create({
            data: await createRecipeCreateStmt({
              recipe,
              verifed: true,
              ingredientMatcher: matcher,
              update: false,
            }),
            ...query,
          });
        },
        async updateRecipe(
          recipeId: string,
          recipe: RecipeInput,
          query?: RecipeQuery
        ): Promise<Recipe> {
          return await client.recipe.update({
            where: { id: recipeId },
            data: buildRecipeStmt({ recipe, verifed: undefined }, true),
            ...query,
          });
        },
        async updateRecipeIngredients(
          recipe: RecipeIngredientUpdateInput,
          query?: RecipeIngredientQuery
        ): Promise<RecipeIngredient[]> {
          // Add, update, then delete
          return await client.$transaction(async (tx) => {
            // Add New Groups
            if (recipe.groupsToAdd && recipe.groupsToAdd.length > 0) {
              await tx.recipeIngredientGroup.createMany({
                data: recipe.groupsToAdd.map((newGroup) => ({
                  name: newGroup,
                  recipeId: recipe.recipeId,
                })),
              });
            }

            //  Delete groups
            if (recipe.groupsToDelete && recipe.groupsToDelete.length > 0) {
              await tx.recipeIngredientGroup.deleteMany({
                where: { id: { in: recipe.groupsToDelete } },
              });
            }

            // Add ingredients
            if (recipe.ingredientsToAdd && recipe.ingredientsToAdd.length > 0) {
              for (const ingredient of recipe.ingredientsToAdd) {
                await tx.recipeIngredient.create({
                  data: buildRecipeIngredientStmt(
                    ingredient,
                    recipe.recipeId,
                    false
                  ),
                });
              }
            }

            // Update ingredients
            if (
              recipe.ingredientsToUpdate &&
              recipe.ingredientsToUpdate.length > 0
            ) {
              for (const ingredient of recipe.ingredientsToUpdate) {
                if (ingredient.id) {
                  await tx.recipeIngredient.update({
                    where: { id: ingredient.id },
                    data: buildRecipeIngredientStmt(
                      ingredient,
                      recipe.recipeId,
                      true
                    ),
                  });
                }
              }
            }

            // Delete ingredients
            if (
              recipe.ingredientsToDelete &&
              recipe.ingredientsToDelete.length > 0
            ) {
              await tx.recipeIngredient.deleteMany({
                where: { id: { in: recipe.ingredientsToDelete } },
              });
            }

            return await tx.recipeIngredient.findMany({
              where: { recipeId: recipe.recipeId },
              ...query,
            });
          });
        },
      },
    },
  });
});

export { createRecipeCreateStmt };
