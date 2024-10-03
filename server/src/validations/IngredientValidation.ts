import { z } from "zod";
import { cleanedStringSchema } from "./utilValidations.js";
import { toTitleCase } from "../util/utils.js";
import { FoodType } from "@prisma/client";

const createIngredientValidation = z.object({
  name: cleanedStringSchema(30, toTitleCase),
  alternateNames: z
    .array(cleanedStringSchema(30, toTitleCase))
    .optional()
    .nullish(),
  storageInstructions: z.string(),
  categoryId: z.string().cuid(),
  expirationRuleId: z.string().cuid().nullish().optional(),
});

const editIngredientValidation = z.object({
  ingredientId: z.string().cuid(),
  name: cleanedStringSchema(30, toTitleCase).nullish().optional(),
  alternateNames: z
    .array(cleanedStringSchema(30, toTitleCase))
    .optional()
    .nullish(),
  storageInstructions: z.string().nullish().optional(),
  categoryId: z.string().cuid().nullish().optional(),
  expirationRuleId: z.string().cuid().nullish().optional(),
});

const createPriceHistoryValidation = z.object({
  ingredientId: z.string().cuid(),
  date: z.date(),
  groceryStore: cleanedStringSchema(20, toTitleCase),
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
  groceryStore: cleanedStringSchema(20, toTitleCase).optional(),
  price: z.number().positive().optional(),
  quantity: z.number().positive().optional(),
  unitId: z.string().cuid().optional(),
  pricePerUnit: z.number().positive().optional(),
  foodType: z.nativeEnum(FoodType).optional(),
  receiptLineId: z.string().cuid().optional(),
});

const createExpirationRuleValidation = z.object({
  name: cleanedStringSchema(30, toTitleCase),
  variant: cleanedStringSchema(30).optional().nullish(),
  defrostTime: z.number().positive().optional().nullish(),
  perishable: z.boolean().optional(),
  tableLife: z.number().gte(0),
  fridgeLife: z.number().gte(0),
  freezerLife: z.number().gte(0),
  ingredientId: z.string().cuid().optional().nullish(),
});

const editExpirationRuleValidation = z.object({
  id: z.string().cuid(),
  name: cleanedStringSchema(30, toTitleCase).optional().nullish(),
  variant: cleanedStringSchema(30).optional().nullish(),
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
