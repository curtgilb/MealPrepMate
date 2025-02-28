import { replaceVulgarFractions } from "@/application/util/fractionToDecimal.js";
import { toNumber } from "@/application/util/TypeCast.js";
import { cleanString } from "@/application/validations/Formatters.js";
import { z } from "zod";

export type RecipeNlpResponse = {
  sentence: string;
  quantity?: number | null | undefined;
  quantityMax?: number | null | undefined;
  unit?: string | null | undefined;
  name?: string | null | undefined;
  comment?: string | null | undefined;
  preparation?: string | null | undefined;
};

const responseValidation = z.object({
  sentence: z.preprocess(cleanString, z.string()),
  quantity: z.preprocess(toNumber, z.number().nullish()),
  quantityMax: z.preprocess(toNumber, z.number().nullish()),
  unit: z.string().nullish(),
  name: z.string().nullish(),
  comment: z.string().nullish(),
  preparation: z.string().nullish(),
});

function removeBulletsAndListMarks(input: string): string {
  // Regular expression to match bullets and list markers in Unicode
  // This pattern focuses on the Dingbats and some Miscellaneous Symbols ranges
  const cleanedString = input.replace(
    /[\u{2022}-\u{2023}\u{25A0}-\u{25FF}\u{2700}-\u{27BF}]/gu,
    ""
  );

  return cleanedString;
}

export async function parseIngredients(
  ingredients: string
): Promise<RecipeNlpResponse[]> {
  const ingredientsByLine = ingredients
    .split("\n")
    .map((ingredient) => {
      const cleaned = removeBulletsAndListMarks(ingredient);
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

  return data.map((item) => responseValidation.parse(item));
}
