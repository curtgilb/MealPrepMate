import { parseIngredients } from "@/infrastructure/IngredientParserClient.js";
import { db } from "@/infrastructure/repository/db.js";
import { z } from "zod";

async function tagIngredients(ingredientList: string) {
  const parsedIngredients = await parseIngredients(ingredientList);

  for (const [index, ingredient] of parsedIngredients.entries()) {
    const cleanedSentence = z.coerce.string().parse(ingredient.sentence);

    await db.ingredient;

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
}
