import { Prisma } from "@prisma/client";
import { readCSV } from "../../services/io/Readers.js";
import { toTitleCase } from "../../util/utils.js";
import { z } from "zod";
import { cleanedStringSchema } from "../../validations/graphqlValidation.js";
import {
  nullableString,
  stringArray,
} from "../../validations/utilValidations.js";

type IngredientParserInput = {
  ingredientCsvPath: string;
  expirationRulePath: string;
};

const ingredientSchema = z.object({
  name: cleanedStringSchema(30, toTitleCase),
  category: cleanedStringSchema(30, toTitleCase),
  variant: nullableString,
  storageInstruction: nullableString,
  expirationRule: z.number().int().positive().nullish(),
  alternativeNanes: stringArray,
  ruleRefId: z.number().int().positive().nullish(),
});

const expirationRuleSchema = z.object({
  refId: z.number().int().positive(),
  name: cleanedStringSchema(30, toTitleCase),
  variant: nullableString,
  leftoverFreshness: z.number().int().positive(),
  tableDays: z.number().int().positive().nullish(),
  fridgeDays: z.number().int().positive().nullish(),
  freezerDays: z.number().int().positive().nullish(),
  defrostTime: z.number().positive().nullish(),
});

export class IngredientLoader {
  ingredientPaths: string;
  expirationRulesPath: string;
  ruleMapping: Map<number, string[]>;

  constructor(input?: IngredientParserInput) {
    this.ingredientPaths = input?.ingredientCsvPath
      ? input.ingredientCsvPath
      : "../../../data/seed_data/Ingredients.csv";
    this.expirationRulesPath = input?.expirationRulePath
      ? input.expirationRulePath
      : "../../../data/seed_data/ExpirationRules.csv";
    this.ruleMapping = new Map<number, string[]>();
  }

  async parseIngredients(): Promise<Prisma.IngredientCreateInput[]> {
    const data = await readCSV(this.ingredientPaths);
    const createStmts: Prisma.IngredientCreateInput[] = [];

    for (const { record } of data) {
      const validatedData = ingredientSchema.parse(record);
      if (validatedData.ruleRefId)
        this.addToMapping(validatedData.ruleRefId, validatedData.name);

      const createStmt: Prisma.IngredientCreateInput = {
        name: validatedData.name,
        variant: validatedData.variant,
        storageInstructions: validatedData.storageInstruction,
        alternateNames: validatedData.alternativeNanes,
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

  private addToMapping(refId: number, name: string) {
    if (!this.ruleMapping.has(refId)) {
      this.ruleMapping.set(refId, []);
    }
    this.ruleMapping.get(refId)?.push(name);
  }

  async parseExpirationRules(): Promise<Prisma.ExpirationRuleCreateInput[]> {
    const data = await readCSV(this.expirationRulesPath);
    const createStmts: Prisma.ExpirationRuleCreateInput[] = [];
    for (const { record } of data) {
      const validatedData = expirationRuleSchema.parse(record);
      const associatedIngredients = this.ruleMapping.get(validatedData.refId);
      createStmts.push({
        name: validatedData.name,
        variant: validatedData.variant,
        defrostTime: validatedData.defrostTime,
        tableLife: validatedData.tableDays,
        fridgeLife: validatedData.fridgeDays,
        freezerLife: validatedData.freezerDays,
        ingredients: associatedIngredients
          ? { connect: associatedIngredients.map((name) => ({ name })) }
          : undefined,
      });
    }
    return createStmts;
  }
}
