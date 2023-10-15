import { parse } from "recipe-ingredient-parser-v3";
import { PrismaClient, Prisma, Recipe } from "@prisma/client";
import fetch from "node-fetch";
import { toNumber } from "../util/Cast.js";
import { RecipeInput } from "../gql.js";
import { RecipeKeeperRecipe } from "../importHelpers/RecipeTransformer.js";
import { cast, CastType } from "../util/Cast.js";
import { readJSON } from "../importHelpers/Readers.js";
import { Mappings } from "../importHelpers/ImportTypes.js";

type RecipeNlpResponse = {
  sentence: string;
  quantity: number;
  unit: string;
  name: string;
  comment: string;
  other: string;
  minQty?: number;
  maxQty?: number;
  matchedIngredient?: string;
};

type IngredientsComparison = {
  changed: boolean;
  added?: Prisma.RecipeIngredientCreateWithoutRecipeInput[];
  deleted?: string[];
};

async function toRecipeCreateInput(
  recipe: RecipeInput,
  db: PrismaClient
): Promise<Prisma.RecipeCreateInput> {
  const data: Prisma.RecipeCreateInput = {
    title: recipe.title,
    source: recipe.source,
    preparationTime: recipe.prepTime,
    cookingTime: recipe.cookTime,
    marinadeTime: recipe.marinadeTime,
    directions: recipe.directions,
    notes: recipe.notes,
    stars: recipe.stars,
    isFavorite: recipe.isFavorite ? recipe.isFavorite : false,
    ingredientsTxt: recipe.ingredients,
  };

  if (recipe.ingredients) {
    data.ingredients = {
      create: await createRecipeIngredients(db, recipe.ingredients),
    };
  }

  // if (recipe.photos) {
  //   data.photos = {
  //     connect: recipe.photos.map((id) => ({ id: id })),
  //   };
  // }

  if (recipe.course) {
    data.course = {
      connect: {
        id: recipe.course,
      },
    };
  }

  if (recipe.category) {
    data.category = {
      connect: recipe.category.map((id) => ({ id: id })),
    };
  }

  if (recipe.cuisine) {
    data.cuisine = {
      connect: {
        id: recipe.cuisine,
      },
    };
  }
  return data;
}

async function toRecipeCreateInputFromRecipeKeeper(
  db: PrismaClient,
  recipes: RecipeKeeperRecipe[]
): Promise<Prisma.RecipeCreateInput[]> {
  const nutrientMappings = readJSON("../mappings.json") as Mappings;

  const convertedRecipes: Prisma.RecipeCreateInput[] = [];
  for (const recipe of recipes) {
    const data: Prisma.RecipeCreateInput = {
      recipeKeeperId: cast(recipe.recipeId) as string,
      title: cast(recipe.name) as string,
      source: cast(recipe.recipeSource) as string,
      preparationTime: getTime(recipe.prepTime),
      cookingTime: getTime(recipe.cookTime),
      directions: cast(recipe.recipeDirections) as string,
      ingredientsTxt: cast(recipe.recipeIngredients) as string,
      notes: cast(recipe.recipeNotes) as string,
      stars: cast(recipe.recipeRating) as number,
      isFavorite: cast(recipe.recipeIsFavourite) as boolean,
      nutritionLabel: {
        create: {
          name: cast(recipe.name) as string,
          source: "RECIPE_KEEPER",
          percentage: 100,
          servings: extractServingSize(recipe.recipeYield),
          nutrients: {
            create: filterNutrients(recipe, nutrientMappings).map(
              (nutrient) => {
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
              }
            ),
          },
        },
      },
    };
    // if (recipe.photos.length > 0) {
    //   data.photos = {
    //     create: recipe.photos.map((photo) => ({
    //       path: photo,
    //       isPrimary: checkIfPrimaryPhoto(photo),
    //     })),
    //   };
    // }

    if (cast(recipe.recipeIngredients) !== undefined) {
      const ingredients = await createRecipeIngredients(
        db,
        recipe.recipeIngredients
      );
      data["ingredients"] = {
        create: ingredients,
      };
    }
    convertedRecipes.push(data);
  }
  return convertedRecipes;
}

function filterNutrients(recipe: RecipeKeeperRecipe, mapping: Mappings) {
  const nutrients = Object.keys(mapping.recipeKeeper);
  const filteredList = nutrients.filter((nutrient) => {
    const key = nutrient as keyof RecipeKeeperRecipe;
    return nutrient in recipe && (cast(recipe[key]) as number);
  });
  return filteredList;
}

async function createRecipeIngredients(
  db: PrismaClient,
  ingredients: string
): Promise<Prisma.RecipeIngredientCreateWithoutRecipeInput[]> {
  const taggedIngredients = await tagIngredients(ingredients);
  const matchedIngredients = await matchIngredients(db, taggedIngredients);
  return matchedIngredients.map((ingredient) => {
    const data: Prisma.RecipeIngredientCreateWithoutRecipeInput = {
      isIngredient: true,
      sentence: cast(ingredient.sentence) as string,
      name: cast(ingredient.name) as string,
      minQuantity: cast(ingredient.minQty) as number,
      maxQuantity: cast(ingredient.maxQty) as number,
      quantity: cast(ingredient.quantity, CastType.NUMBER) as number,
      comment: cast(ingredient.comment) as string,
      other: cast(ingredient.other) as string,
      unit: cast(ingredient.unit) as string,
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
  const newIngredients: string[] = [];
  sentences.forEach((sentence) => {
    if (!existingSentences.includes(sentence)) {
      newIngredients.push(sentence);
    }
  });
  if (newIngredients.length > 0) {
    ingredientsComparison.added = await createRecipeIngredients(
      db,
      newIngredients.join("\n")
    );
  }

  // existingIngredients.forEach((ingredient) => {
  //   if (!newIngredientsText.includes(ingredient.sentence)) {
  //     ingredientsComparison.deleted.push(ingredient.id);
  //   }
  // });

  // ingredientsComparison.changed =
  //   newIngredients.length > 0 || ingredientsComparison.deleted.length > 0;
  return ingredientsComparison;
}

// Takes names from a parsed ingrdient line and will attempt to find a match in the database. The match is added to the recipeNLPresponse as matchingIngredient (ID)
async function matchIngredients(
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
  return matchedIngredients;
}

// Extracts the serving size from the servings text
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const response = await fetch("http://127.0.0.1/parse", {
    method: "post",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const taggedIngredients = (await response.json()) as RecipeNlpResponse[];
  return taggedIngredients.map((ingredient) => {
    console.log(ingredient.sentence);
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

function cleanIngredientResponse(
  ingredientInput: RecipeNlpResponse
): RecipeNlpResponse {
  const { sentence, quantity, unit, name, comment, other } = ingredientInput;
  const data: RecipeNlpResponse = {
    sentence: cast(sentence) as string,
    quantity: cast(quantity) as number,
    unit: cast(unit) as string,
    name: cast(name) as string,
    comment: cast(comment) as string,
    other: cast(other) as string,
  };
  if (ingredientInput.matchedIngredient) {
    data.matchedIngredient = cast(ingredientInput.matchedIngredient) as string;
  }
  return data;
}

export {
  tagIngredients,
  extractServingSize,
  checkIfPrimaryPhoto,
  compareIngredients,
  matchIngredients,
  createRecipeIngredients,
  toRecipeCreateInput,
  toRecipeCreateInputFromRecipeKeeper,
};
