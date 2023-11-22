import { RecipeNlpResponse } from "../../types/CustomTypes.js";
import { parse } from "recipe-ingredient-parser-v3";
import { cast } from "../../util/Cast.js";
import fetch from "node-fetch";

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

export { tagIngredients };
