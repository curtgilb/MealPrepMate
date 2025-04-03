import { toTitleCase } from "@/application/util/utils.js";
import {
  cleanString,
  toStringList,
} from "@/application/validations/Formatters.js";
import { readCSV } from "@/infrastructure/file_io/read.js";
import { db } from "@/infrastructure/repository/db.js";
import { z } from "zod";

const ingredientSchema = z.object({
  id: z.string().uuid(),
  name: z.preprocess(cleanString, z.string()).transform(toTitleCase),
  category: z.preprocess(cleanString, z.string()).transform(toTitleCase),
  variant: z
    .preprocess(cleanString, z.string().nullish())
    .transform(toTitleCase),
  storageInstruction: z.preprocess(cleanString, z.string().optional()),
  alternativeNames: z.preprocess(toStringList, z.string().array().nullish()),
  expirationRule: z.preprocess(cleanString, z.string().uuid().nullish()),
});

export async function loadIngredients() {
  const ingredients = await readCSV({
    path: "/data/seed_data/Ingredients.csv",
    camelCaseHeaders: true,
    schema: ingredientSchema,
  });

  for (const ingredient of ingredients) {
    await db.ingredient.upsert({
      where: { id: ingredient.id },
      create: {
        id: ingredient.id,
        name: ingredient.name as string,
        category: ingredient.category
          ? {
              connectOrCreate: {
                where: { name: ingredient.category },
                create: { name: ingredient.category },
              },
            }
          : undefined,
        variant: ingredient.variant,
        storageInstructions: ingredient.storageInstruction,
        alternateNames: ingredient.alternativeNames ?? [],
        expirationRule: ingredient.expirationRule
          ? { connect: { id: ingredient.expirationRule } }
          : undefined,
      },
      update: {
        id: ingredient.id,
        name: ingredient.name as string,
        category: ingredient.category
          ? {
              connectOrCreate: {
                where: { name: ingredient.category },
                create: { name: ingredient.category },
              },
            }
          : undefined,
        variant: ingredient.variant,
        storageInstructions: ingredient.storageInstruction,
        alternateNames: ingredient.alternativeNames ?? [],
        expirationRule: ingredient.expirationRule
          ? { connect: { id: ingredient.expirationRule } }
          : undefined,
      },
    });
  }
}
