import { PrismaClient, Recipe as PrismaRecipe } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { RecipeInput } from "../gql.js";
import { parse } from "recipe-ingredient-parser-v3";
import { cast } from "../util/Cast.js";

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

type RecipeQuery = {
  include?: Prisma.RecipeInclude | undefined;
  select?: Prisma.RecipeSelect | undefined;
};

export class RecipeModel {
  constructor(protected readonly db: PrismaClient) {}
  async createRecipe(
    recipe: RecipeInput,
    query: RecipeQuery
  ): Promise<PrismaRecipe> {
    return await this.db.recipe.create({
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
          create: recipe.photos?.map((photoId) => ({ photoId: photoId })),
        },
        // isFavorite: recipe.isFavorite,
        // course: {
        //   connect: {id: }
        // }
      },
      ...query,
    });
  }

  protected async tagIngredients(
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

  // Takes names from a parsed ingrdient line and will attempt to find a match in the database. The match is added to the recipeNLPresponse as matchingIngredient (ID)
  protected async matchIngredients(
    taggedIngredients: RecipeNlpResponse[]
  ): Promise<RecipeNlpResponse[]> {
    const matchedIngredients = [];
    for (const ingredient of taggedIngredients) {
      const matchingIngredient = await this.db.ingredient.findFirst({
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

  protected cleanIngredientResponse(
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
      data.matchedIngredient = cast(
        ingredientInput.matchedIngredient
      ) as string;
    }
    return data;
  }

  protected async createRecipeIngredientsStmt(
    ingredients: string
  ): Promise<Prisma.RecipeIngredientCreateNestedManyWithoutRecipeInput> {
    const taggedIngredients = await this.tagIngredients(ingredients);
    const matchedIngredients = await this.matchIngredients(taggedIngredients);
    const ingredientsToCreate = matchedIngredients.map((ingredient, index) => {
      const data: Prisma.RecipeIngredientCreateWithoutRecipeInput = {
        isIngredient: true,
        order: index,
        sentence: cast(ingredient.sentence) as string,
        name: cast(ingredient.name) as string,
        minQuantity: cast(ingredient.minQty) as number,
        maxQuantity: cast(ingredient.maxQty) as number,
        quantity: cast(ingredient.quantity) as number,
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
    return { create: ingredientsToCreate };
  }
}
