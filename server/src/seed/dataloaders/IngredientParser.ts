import { Prisma } from "@prisma/client";

import { toTitleCase } from "@/util/utils.js";
import { z } from "zod";
import { cleanedStringSchema } from "@/validations/RecipeValidation.js";
import { nullableString, stringArray } from "@/validations/utilValidations.js";
import { readCSV } from "@/infrastructure/Readers.js";

type IngredientParserInput = {
  ingredientCsvPath: string;
  expirationRulePath: string;
};

function neutralValuesToNull<T extends z.ZodTypeAny>(zodType: T) {
  return z.preprocess(
    (val) => (val === "" || val === undefined ? null : val),
    zodType
  );
}

const ingredientSchema = z.object({
  id: z.string().cuid(),
  name: cleanedStringSchema(60, toTitleCase),
  category: cleanedStringSchema(30, toTitleCase),
  variant: nullableString,
  storageInstruction: nullableString,
  alternativeNames: neutralValuesToNull(stringArray).nullable(),
  expirationRule: neutralValuesToNull(z.nullable(z.string().cuid())),
});

const expirationRuleSchema = z.object({
  id: z.string().cuid(),
  name: cleanedStringSchema(50, toTitleCase),
  variant: nullableString,
  tableDays: z.coerce.number().int().nullish(),
  fridgeDays: z.coerce.number().int().nullish(),
  freezerDays: z.coerce.number().int().nullish(),
  defrostTime: z.coerce.number().nullish(),
});

export class IngredientLoader {
  ingredientPaths: string;
  expirationRulesPath: string;

  constructor(input?: IngredientParserInput) {
    this.ingredientPaths = input?.ingredientCsvPath
      ? input.ingredientCsvPath
      : "../../data/seed_data/Ingredients.csv";
    this.expirationRulesPath = input?.expirationRulePath
      ? input.expirationRulePath
      : "../../data/seed_data/ExpirationRules.csv";
  }

  async parseIngredients(): Promise<Prisma.IngredientCreateInput[]> {
    const data = await readCSV(this.ingredientPaths);
    const createStmts: Prisma.IngredientCreateInput[] = [];

    for (const { record } of data) {
      const validatedData = ingredientSchema.parse(record);

      const createStmt: Prisma.IngredientCreateInput = {
        id: validatedData.id,
        name: validatedData.name,
        variant: validatedData.variant,
        storageInstructions: validatedData.storageInstruction,
        alternateNames: validatedData.alternativeNames
          ? validatedData.alternativeNames
          : undefined,
        expirationRule: validatedData.expirationRule
          ? {
              connect: {
                id: validatedData.expirationRule,
              },
            }
          : undefined,
        category: {
          connectOrCreate: {
            create: {
              name: validatedData.category,
            },
            where: {
              name: validatedData.category,
            },
          },
        },
      };
      createStmts.push(createStmt);
    }
    return createStmts;
  }

  async parseExpirationRules(): Promise<Prisma.ExpirationRuleCreateInput[]> {
    const data = await readCSV(this.expirationRulesPath);
    const createStmts: Prisma.ExpirationRuleCreateInput[] = [];
    for (const { record } of data) {
      const validatedData = expirationRuleSchema.parse(record);
      createStmts.push({
        id: validatedData.id,
        name: validatedData.name,
        variant: validatedData.variant,
        defrostTime: validatedData.defrostTime,
        tableLife: validatedData.tableDays,
        fridgeLife: validatedData.fridgeDays,
        freezerLife: validatedData.freezerDays,
      });
    }
    return createStmts;
  }
}
