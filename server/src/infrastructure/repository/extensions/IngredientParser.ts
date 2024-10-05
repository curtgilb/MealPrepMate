import { z } from "zod";
import { coerceNumeric } from "@/validations/utilValidations.js";
import { IngredientMatcher } from "@/domain/extensions/IngredientMatcher.js";

import { db } from "@/infrastructure/repository/db.js";

export type RecipeNlpResponse = {
  sentence: string;
  quantity: number | null | undefined;
  quantityMax: number | null | undefined;
  unit: string;
  name: string;
  comment: string;
  preparation: string;
};

type MatchedNlpResponse = RecipeNlpResponse & {
  order: number;
  ingredientId: string | null | undefined;
  unitId: string | null | undefined;
};

async function parseIngredients(
  ingredients: string
): Promise<RecipeNlpResponse[]> {
  const ingredientsByLine = ingredients
    .split("\n")
    .map((ingredient) => {
      const cleaned = replaceVulgarFractions(ingredient);
      return cleaned.trim();
    })
    .filter((sentence) => sentence);
  const body = {
    ingredients: ingredientsByLine,
    confidence: false,
  };

  const response = await fetch(`${process.env.NLP_URL}/parse`, {
    method: "post",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });

  const data = (await response
    .json()
    .catch((err) => console.log(err))) as RecipeNlpResponse[];

  return data;
}

async function matchIngredients(ingredients: RecipeNlpResponse[]) {
  const matchedIngredients: MatchedNlpResponse[] = [];
  for (const [index, ingredient] of ingredients.entries()) {
    const cleanedSentence = z.coerce.string().parse(ingredient.sentence);

    await db.ingredient.findFirst({where: });

    matchedIngredients.push({
      ...ingredient,
      sentence: cleanedSentence,
      name: z.coerce.string().parse(ingredient.name),
      quantity: z
        .preprocess(coerceNumeric, z.number().nullish())
        .parse(ingredient.quantity),
      order: index,
      ingredientId: matches.ingredientId,
      unitId: matches.unitId,
    });
  }
  return matchedIngredients;
}

export {
  parseIngredients as tagIngredients,
  matchIngredients,
  MatchedNlpResponse,
};
