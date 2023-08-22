import { parse } from "recipe-ingredient-parser-v3";
import fetch from "node-fetch";
import { PrismaClient, Prisma, Recipe } from "@prisma/client";
import { toNumber } from "../util/Cast";

type RecipeNlpResponse = {
  sentence: string;
  quantity: number;
  order: number;
  unit: string;
  name: string;
  comment: string;
  other: string;
  minQty?: number;
  maxQty?: number;
  ingredient?: object;
  matchedIngredient?: string;
};

type IngredientsComparison = {
  changed: boolean;
  added?: RecipeNlpResponse[];
  deleted?: string[];
};

// take the update, compare it with what is already there, and return what needs to be added/deleted
async function compareIngredients(
  db: PrismaClient,
  recipeId: string,
  newIngredientsText: string
): Promise<IngredientsComparison> {
  const ingredientsComparison: IngredientsComparison = {
    changed: false,
    added: [],
    deleted: [],
  };
  const existingIngredients = await db.recipeIngredient.findMany({
    where: {
      recipeId,
    },
  });
  const existingSentences = existingIngredients.map(
    (ingredient) => ingredient.sentence
  );
  const sentences = newIngredientsText.split("\n");
  const newIngredients = [];
  sentences.forEach((sentence) => {
    if (!existingSentences.includes(sentence)) {
      newIngredients.push(sentence);
    }
  });
  existingIngredients.forEach((ingredient) => {
    if (!newIngredientsText.includes(ingredient.sentence)) {
      ingredientsComparison.deleted.push(ingredient.sentence);
    }
  });
  ingredientsComparison.changed =
    newIngredients.length > 0 || ingredientsComparison.deleted.length > 0;
  return ingredientsComparison;
}

// Takes names from a parsed ingrdient line and will attempt to find a match in the database
async function matchToIngredients(
  db: PrismaClient,
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
  return;
}

//Check the filename to see if the path is primary photo in Recipe Keeper
function checkIfPrimaryPhoto(filePath: string): boolean {
  const removedExtension = filePath.replace(/\.[^/.]+$/, "");
  return removedExtension.endsWith("_0");
}

// Extracts the serving size from the servings text
function extractServingSize(input: string): number {
  if (input !== undefined && input !== null) {
    const numbers = input.match(/\d+\.\d+|\d+\b|\d+(?=\w)/g);
    if (numbers.length > 0) {
      return toNumber(numbers[0]);
    }
  }
  return 1;
}

async function createRecipeIngredients(
  db: PrismaClient,
  ingredients: string
): Promise<Prisma.RecipeIngredientCreateWithoutRecipeInput[]> {
  const taggedIngredients = await tagIngredients(ingredients);
  const matchedIngredients = await matchToIngredients(db, taggedIngredients);
  return matchedIngredients.map((ingredient) => {
    return {
      isIngredient: true,
      sentence: ingredient.sentence,
      name: ingredient.name,
      minQuantity: ingredient.minQty,
      maxQuantity: ingredient.maxQty,
      quantity: ingredient.quantity,
      comment: ingredient.comment,
      other: ingredient.other,
      unit: ingredient.unit,
      ingredient: {
        connect: {
          id: ingredient.matchedIngredient,
        },
      },
    };
  });
}

async function tagIngredients(
  ingredients: string
): Promise<RecipeNlpResponse[]> {
  const ingredientsByLine = ingredients.split("\n");
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
  return taggedIngredients.map((ingredient, index) => {
    const { minQty, maxQty } = parse(ingredient.sentence, "eng");
    return {
      order: index,
      minQty,
      maxQty,
      ...ingredient,
    };
  });
}
export {
  tagIngredients,
  extractServingSize,
  checkIfPrimaryPhoto,
  compareIngredients,
  matchToIngredients,
  createRecipeIngredients,
};
