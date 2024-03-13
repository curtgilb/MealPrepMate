import { z } from "zod";
import { coerceNumeric } from "../validations/utilValidations.js";
import { IngredientMatcher } from "./IngredientMatcher.js";

type RecipeNlpResponse = {
  sentence: string;
  quantity: number | null | undefined;
  unit: string;
  name: string;
  comment: string;
  preparation: string;
  other: string;
};

type MatchedNlpResponse = RecipeNlpResponse & {
  order: number;
  ingredientId: string | null | undefined;
  unitId: string | null | undefined;
};

async function tagIngredients(
  ingredients: string,
  matcher: IngredientMatcher,
  matchingRecipeId?: string
): Promise<MatchedNlpResponse[]> {
  const ingredientsByLine = ingredients
    .split("\n")
    .filter((sentence) => sentence);
  const body = {
    ingredients: ingredientsByLine,
    confidence: false,
  };

  const response = await fetch("http://127.0.0.1/parse", {
    method: "post",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });

  const data = (await response.json()) as RecipeNlpResponse[];

  return await Promise.all(
    data.map(async (ingredient, index) => {
      const cleanedSentence = z.coerce.string().parse(ingredient.sentence);
      const matches = await matcher.match({
        ingredientName: ingredient.name,
        unit: ingredient.unit,
        matchingRecipeSearch: {
          matchingRecipeId: matchingRecipeId,
          fullIngredientLine: cleanedSentence,
        },
      });

      return {
        ...ingredient,
        sentence: cleanedSentence,
        name: z.coerce.string().parse(ingredient.name),
        quantity: z
          .preprocess(coerceNumeric, z.number().nullish())
          .parse(ingredient.quantity),
        order: index,
        ingredientId: matches.ingredientId,
        unitId: matches.unitId,
      };
    })
  );
}

export { tagIngredients, MatchedNlpResponse };
