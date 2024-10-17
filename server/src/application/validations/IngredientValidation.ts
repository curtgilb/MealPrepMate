import { z } from "zod";

import { toTitleCase } from "../util/utils.js";
import { FoodType } from "@prisma/client";
import { cleanString } from "@/application/validations/Formatters.js";

const cleanedStringSchema = z
  .preprocess(cleanString, z.string())
  .transform(toTitleCase);

const createIngredientValidation = z.object({
  name: cleanedStringSchema,
  alternateNames: z.array(cleanedStringSchema).optional().nullish(),
  storageInstructions: z.string(),
  categoryId: z.string().cuid(),
  expirationRuleId: z.string().cuid().nullish().optional(),
});

const editIngredientValidation = z.object({
  ingredientId: z.string().cuid(),
  name: cleanedStringSchema.nullish().optional(),
  alternateNames: z.array(cleanedStringSchema).optional().nullish(),
  storageInstructions: z.string().nullish().optional(),
  categoryId: z.string().cuid().nullish().optional(),
  expirationRuleId: z.string().cuid().nullish().optional(),
});

const createPriceHistoryValidation = z.object({
  ingredientId: z.string().cuid(),
  date: z.date(),
  groceryStore: cleanedStringSchema,
  price: z.number().positive(),
  quantity: z.number().positive(),
  unitId: z.string().cuid(),
  pricePerUnit: z.number().positive(),
  foodType: z.nativeEnum(FoodType).optional(),
  receiptLineId: z.string().cuid().optional(),
});

const editPriceHistoryValidation = z.object({
  ingredientId: z.string().cuid().optional(),
  date: z.date().optional(),
  groceryStore: cleanedStringSchema,
  price: z.number().positive().optional(),
  quantity: z.number().positive().optional(),
  unitId: z.string().cuid().optional(),
  pricePerUnit: z.number().positive().optional(),
  foodType: z.nativeEnum(FoodType).optional(),
  receiptLineId: z.string().cuid().optional(),
});

const createExpirationRuleValidation = z.object({
  name: cleanedStringSchema,
  variant: cleanedStringSchema,
  defrostTime: z.number().positive().optional().nullish(),
  perishable: z.boolean().optional(),
  tableLife: z.number().gte(0),
  fridgeLife: z.number().gte(0),
  freezerLife: z.number().gte(0),
  ingredientId: z.string().cuid().optional().nullish(),
});

const editExpirationRuleValidation = z.object({
  id: z.string().cuid(),
  name: cleanedStringSchema.optional().nullish(),
  variant: cleanedStringSchema,
  defrostTime: z.number().positive().optional().nullish(),
  perishable: z.boolean().optional(),
  tableLife: z.number().gte(0).optional().nullish(),
  fridgeLife: z.number().gte(0).optional().nullish(),
  freezerLife: z.number().gte(0).optional().nullish(),
});

export {
  createIngredientValidation,
  createPriceHistoryValidation,
  editPriceHistoryValidation,
  createExpirationRuleValidation,
  editIngredientValidation,
  editExpirationRuleValidation,
};
