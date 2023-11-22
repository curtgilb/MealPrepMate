import { MeasurementUnit, Prisma, Recipe } from "@prisma/client";
import { RecipeInput } from "../types/gql.js";
import { tagIngredients } from "../services/ingredient/IngredientService.js";
import { cast, toNumber } from "../util/Cast.js";
import { RecipeNlpResponse, RecipeKeeperRecipe } from "../types/CustomTypes.js";
import { toTitleCase } from "../util/utils.js";
import { db } from "../db.js";

type RecipeQuery = {
  include?: Prisma.RecipeInclude | undefined;
  select?: Prisma.RecipeSelect | undefined;
};

export const recipeExtensions = Prisma.defineExtension((client) => {
  // ===========================================Helper functions=============================
  function matchUnit(
    units: MeasurementUnit[],
    search: string
  ): MeasurementUnit | undefined {
    const matches = units.filter((unit) => {
      return (
        unit.name.toLowerCase().includes(search.toLowerCase()) ||
        unit.abbreviations.some((abbrev) =>
          abbrev.toLowerCase().includes(search.toLowerCase())
        )
      );
    });

    if (matches.length > 0) {
      return matches[0];
    }
    return undefined;
  }

  async function createRecipeIngredientsStmt(
    ingredients: string | undefined | null
  ): Promise<
    Prisma.RecipeIngredientCreateNestedManyWithoutRecipeInput | undefined
  > {
    if (!ingredients) {
      return undefined;
    }
    const taggedIngredients = await tagIngredients(ingredients);
    const matchedIngredients = await matchIngredients(taggedIngredients);
    const units = await db.measurementUnit.findMany({});

    const ingredientsToCreate = matchedIngredients.map((ingredient, index) => {
      const data: Prisma.RecipeIngredientCreateWithoutRecipeInput = {
        order: index,
        sentence: cast(ingredient.sentence) as string,
        name: cast(ingredient.name) as string,
        minQuantity: cast(ingredient.minQty) as number,
        maxQuantity: cast(ingredient.maxQty) as number,
        quantity: cast(ingredient.quantity) as number,
        comment: cast(ingredient.comment) as string,
        other: cast(ingredient.other) as string,
      };
      if (ingredient.matchedIngredient !== undefined) {
        data.ingredient = {
          connect: {
            id: cast(ingredient.matchedIngredient) as string,
          },
        };
      }
      const matchedUnit = matchUnit(units, ingredient.unit);
      if (matchedUnit) {
        data.unit = {
          connect: { id: matchedUnit.id },
        };
      }
      return data;
    });
    return { create: ingredientsToCreate };
  }

  // Takes names from a parsed ingrdient line and will attempt to find a match in the database. The match is added to the recipeNLPresponse as matchingIngredient (ID)
  async function matchIngredients(
    taggedIngredients: RecipeNlpResponse[]
  ): Promise<RecipeNlpResponse[]> {
    const matchedIngredients = [];
    for (const ingredient of taggedIngredients) {
      const matchingIngredient = await db.ingredient.findFirst({
        where: {
          OR: [
            {
              name: {
                contains: ingredient.name,
                mode: "insensitive",
              },
            },
            {
              alternateNames: {
                has: toTitleCase(ingredient.name),
              },
            },
          ],
        },
      });
      if (matchingIngredient !== null) {
        ingredient.matchedIngredient = matchingIngredient.id;
      }
      matchedIngredients.push(ingredient);
    }
    return matchedIngredients;
  }

  function createCourseStmt(courses: string[]): unknown {
    const newCourses = courses
      .filter((course) => cast(course) as string)
      .map((course) => {
        const name = toTitleCase(cast(course) as string);
        const stmt = {
          where: { name },
          create: { name },
        };
        return stmt;
      });

    if (newCourses.length < 1) return undefined;
    return { connectOrCreate: newCourses };
  }

  function buildPhotosStmt(
    recipe: RecipeKeeperRecipe,
    imageMapping: { [key: string]: string }
  ): Prisma.PhotoCreateNestedManyWithoutRecipeInput | undefined {
    if (recipe.photos.length > 0) {
      return {
        connect: recipe.photos.map((photo) => ({ hash: imageMapping[photo] })),
      };
    }
    return undefined;
  }

  function createRecipeKeeperNutritionLabel(
    recipe: RecipeKeeperRecipe
  ): Prisma.NutritionLabelCreateNestedManyWithoutRecipeInput {
    const servings = toNumber(recipe.recipeYield);

    return {
      create: {
        name: recipe.name,
        servings: cast(recipe.recipeYield) as number,
        nutrients: {
          createMany: {
            data: recipe.nutrients.map((nutrient) => ({
              nutrientId: nutrient.id,
              value: nutrient.amount,
              valuePerServing: nutrient.amount / (servings ? servings : 1),
            })),
          },
        },
      },
    };
  }

  //Check the filename to see if the path is primary photo in Recipe Keeper
  // function checkIfPrimaryPhoto(filePath: string): boolean {
  //   const removedExtension = filePath.replace(/\.[^/.]+$/, "");
  //   return removedExtension.endsWith("_0");
  // }

  return client.$extends({
    model: {
      recipe: {
        async createRecipe(
          recipe: RecipeInput,
          query?: RecipeQuery
        ): Promise<Recipe> {
          return await client.recipe.create({
            data: {
              title: toTitleCase(recipe.title),
              source: recipe.source,
              preparationTime: recipe.prepTime,
              cookingTime: recipe.cookTime,
              marinadeTime: recipe.marinadeTime,
              directions: recipe.directions,
              notes: recipe.notes,
              stars: recipe.stars,
              photos: {
                connect: recipe.photoIds?.map((photoId) => ({ id: photoId })),
              },
              isFavorite: recipe.isFavorite || false,
              course: {
                connect: recipe.courseIds?.map((id) => ({ id })),
              },
              category: {
                connect: recipe.categoryIds?.map((id) => ({ id })),
              },
              cuisine: {
                connect: recipe.cuisineId
                  ? { id: recipe.cuisineId }
                  : undefined,
              },
              ingredients: await createRecipeIngredientsStmt(
                recipe.ingredients
              ),
              leftoverFreezerLife: recipe.leftoverFreezerLife,
              leftoverFridgeLife: recipe.leftoverFridgeLife,
            },
            ...query,
          });
        },

        // Recipe Keeper methods
        async createRecipeKeeperRecipe(
          recipe: RecipeKeeperRecipe,
          imageMapping: { [key: string]: string },
          query?: RecipeQuery
        ): Promise<Prisma.RecipeCreateInput> {
          return await client.recipe.create({
            data: {
              recipeKeeperId: cast(toTitleCase(recipe.recipeId)) as string,
              title: cast(toTitleCase(recipe.name)) as string,
              source: cast(recipe.recipeSource) as string,
              preparationTime: cast(recipe.prepTime) as number,
              cookingTime: cast(recipe.cookTime) as number,
              directions: cast(recipe.recipeDirections) as string,
              notes: cast(recipe.recipeNotes) as string,
              stars: cast(recipe.recipeRating) as number,
              isFavorite: cast(recipe.recipeIsFavourite) as boolean,
              nutritionLabel: createRecipeKeeperNutritionLabel(recipe),
              photos: buildPhotosStmt(recipe, imageMapping),
              isVerified: false,
              course: createCourseStmt(
                recipe.recipeCourse
              ) as Prisma.CourseCreateNestedManyWithoutRecipesInput,
              category: createCourseStmt(
                recipe.recipeCategory
              ) as Prisma.CategoryCreateNestedManyWithoutRecipesInput,
              ingredients: await createRecipeIngredientsStmt(
                recipe.recipeIngredients
              ),
            },
            ...query,
          });
        },
      },
    },
  });
});
