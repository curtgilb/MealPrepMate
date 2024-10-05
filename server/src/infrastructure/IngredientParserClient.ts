import { replaceVulgarFractions } from "@/util/fractionToDecimal.js";

export type RecipeNlpResponse = {
  sentence: string;
  quantity: number | null | undefined;
  quantityMax: number | null | undefined;
  unit: string;
  name: string;
  comment: string;
  preparation: string;
};

export async function parseIngredients(
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
