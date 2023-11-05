import { Prisma, Recipe as PrismaRecipe } from "@prisma/client";
import { RecipeInput } from "../types/gql.js";
import { parse } from "recipe-ingredient-parser-v3";
import { cast, toNumber } from "../util/Cast.js";
import {
  RecipeNlpResponse,
  RecipeKeeperRecipe,
  Mappings,
} from "../types/CustomTypes.js";
import { readJSON } from "../services/io/Readers.js";
import { db } from "../db.js";
import { toTitleCase } from "../util/utils.js";

type RecipeQuery = {
  include?: Prisma.RecipeInclude | undefined;
  select?: Prisma.RecipeSelect | undefined;
};

async function createRecipe(
  recipe: RecipeInput,
  query?: RecipeQuery
): Promise<PrismaRecipe> {
  return await db.recipe.create({
    data: {
      title: recipe.title,
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
        connect: recipe.cuisineId ? { id: recipe.cuisineId } : undefined,
      },
      ingredients: await createRecipeIngredientsStmt(recipe.ingredients),
      leftoverFreezerLife: recipe.leftoverFreezerLife,
      leftoverFridgeLife: recipe.leftoverFridgeLife,
    },
    ...query,
  });
}

// ===========================================Helper functions=============================

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
      // unit: cast(ingredient.unit) as string,
    };
    if (ingredient.matchedIngredient !== undefined) {
      data.ingredient = {
        connect: {
          id: cast(ingredient.matchedIngredient) as string,
        },
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
              some: {
                name: { contains: ingredient.name, mode: "insensitive" },
              },
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

async function tagIngredients(
  ingredients: string
): Promise<RecipeNlpResponse[]> {
  const ingredientsByLine = ingredients
    .split("\n")
    .filter((sentence) => cast(sentence));
  const body = {
    ingredients: ingredientsByLine,
    confidence: false,
  };

  const response = await fetch("http://127.0.0.1/parse", {
    method: "post",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });

  const taggedIngredients = (await response.json()) as RecipeNlpResponse[];
  return taggedIngredients.map((ingredient) => {
    let minQty = undefined;
    let maxQty = undefined;
    try {
      const parsing = parse(ingredient.sentence, "eng");
      minQty = parsing.minQty;
      maxQty = parsing.maxQty;
    } catch {
      console.log("Unable to parse ingredient: " + ingredient.sentence);
    }
    return {
      ...ingredient,
      minQty,
      maxQty,
    };
  });
}

// function cleanIngredientResponse(
//   ingredientInput: RecipeNlpResponse
// ): RecipeNlpResponse {
//   const { sentence, quantity, unit, name, comment, other } = ingredientInput;
//   const data: RecipeNlpResponse = {
//     sentence: cast(sentence) as string,
//     quantity: cast(quantity) as number,
//     unit: cast(unit) as string,
//     name: cast(name) as string,
//     comment: cast(comment) as string,
//     other: cast(other) as string,
//   };
//   if (ingredientInput.matchedIngredient) {
//     data.matchedIngredient = cast(ingredientInput.matchedIngredient) as string;
//   }
//   return data;
// }

// Recipe Keeper methods
async function createRecipeKeeperRecipe(
  recipe: RecipeKeeperRecipe,
  imageMapping: { [key: string]: string },
  query?: RecipeQuery
): Promise<PrismaRecipe> {
  const dbStmt: Prisma.RecipeCreateInput = {
    recipeKeeperId: cast(recipe.recipeId) as string,
    title: cast(recipe.name) as string,
    source: cast(recipe.recipeSource) as string,
    preparationTime: getTime(recipe.prepTime),
    cookingTime: getTime(recipe.cookTime),
    directions: cast(recipe.recipeDirections) as string,
    notes: cast(recipe.recipeNotes) as string,
    stars: cast(recipe.recipeRating) as number,
    isFavorite: cast(recipe.recipeIsFavourite) as boolean,
    nutritionLabel: buildNutritionStmt(recipe),
    photos: buildPhotosStmt(recipe, imageMapping),
    isVerified: false,
    course: createCourseStmt(
      recipe.recipeCourse
    ) as Prisma.CourseCreateNestedManyWithoutRecipesInput,
    category: createCourseStmt(
      recipe.recipeCategory
    ) as Prisma.CategoryCreateNestedManyWithoutRecipesInput,
    ingredients: await createRecipeIngredientsStmt(recipe.recipeIngredients),
  };

  return await db.recipe.create({ data: dbStmt, ...query });
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
): Prisma.RecipePhotosCreateNestedManyWithoutRecipeInput | undefined {
  if (recipe.photos.length > 0) {
    return {
      create: recipe.photos.map((photo) => ({
        isPrimary: checkIfPrimaryPhoto(photo),
        photo: {
          connect: {
            hash: imageMapping[photo],
          },
        },
      })),
    };
  }
  return undefined;
}

//Check the filename to see if the path is primary photo in Recipe Keeper
function checkIfPrimaryPhoto(filePath: string): boolean {
  const removedExtension = filePath.replace(/\.[^/.]+$/, "");
  return removedExtension.endsWith("_0");
}

function filterNutrients(recipe: RecipeKeeperRecipe, mapping: Mappings) {
  const nutrients = Object.keys(mapping.recipeKeeper);
  const filteredList = nutrients.filter((nutrient) => {
    const key = nutrient as keyof RecipeKeeperRecipe;
    return nutrient in recipe && (cast(recipe[key]) as number);
  });
  return filteredList;
}

function buildNutritionStmt(
  recipe: RecipeKeeperRecipe
): Prisma.NutritionLabelCreateNestedManyWithoutRecipeInput {
  const nutrientMappings = readJSON("../mappings.json") as Mappings;
  return {
    create: {
      name: cast(recipe.name) as string,
      source: "RECIPE_KEEPER",
      percentage: 100,
      servings: extractServingSize(recipe.recipeYield),
      nutrients: {
        create: filterNutrients(recipe, nutrientMappings).map((nutrient) => {
          const key = nutrient as keyof RecipeKeeperRecipe;
          const name = nutrientMappings.recipeKeeper[nutrient];
          return {
            nutrient: {
              connect: {
                name: name,
              },
            },
            value: cast(recipe[key] as string) as number,
          };
        }),
      },
    },
  };
}

function getTime(input: string): number {
  const match = Array.from(input.matchAll(/(?<time>\d+)(?<unit>.)/gm))[0];
  if (match.groups) {
    const time: number = parseInt(match.groups.time);
    const unit: string = match.groups.unit;
    if (unit === "S") {
      return time / 60;
    } else if (unit === "H") {
      return time * 60;
    } else {
      return time;
    }
  }
  return 0;
}

function extractServingSize(input: string): number {
  if (input !== undefined && input !== null) {
    const numbers = input.match(/\d+\.\d+|\d+\b|\d+(?=\w)/g);
    if (numbers !== null && numbers.length > 0) {
      const result = toNumber(numbers[0]);
      return result === undefined ? 1 : result;
    }
  }
  return 1;
}

export { createRecipe, createRecipeKeeperRecipe };
