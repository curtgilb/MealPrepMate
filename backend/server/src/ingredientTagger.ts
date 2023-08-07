import { parse } from "recipe-ingredient-parser-v3";
import fetch from "node-fetch";

type RecipeNlpResponse = {
  sentence: string;
  quantity: string;
  unit: string;
  name: string;
  comment: string;
  other: string;
  minQty?: number;
  maxQty?: number;
};

async function tagIngredients(
  ingredients: string[]
): Promise<RecipeNlpResponse[]> {
  const body = {
    ingredients: ingredients,
    confidence: false,
  };
  const response = await fetch("http://127.0.0.1/parse", {
    method: "post",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
  const taggedIngredients = (await response.json()) as RecipeNlpResponse[];
  return taggedIngredients.map((ingredient) => {
    const { minQty, maxQty } = parse(ingredient.sentence, "eng");
    return {
      minQty,
      maxQty,
      ...ingredient,
    };
  });
}

export { tagIngredients };
