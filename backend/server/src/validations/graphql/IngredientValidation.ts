import { z } from "zod";
import { cleanedStringSchema } from "../utilValidations.js";
import { toTitleCase } from "../../util/utils.js";

const createIngredientValidation = z.object({
  name: cleanedStringSchema(30, toTitleCase),
  alternateNames: z
    .array(cleanedStringSchema(30, toTitleCase))
    .optional()
    .nullish(),
  storageInstructions: z.string(),
});

const createPriceHistoryValidation = z.object({
  ingredientId: z.string().cuid(),
  date: z.date(),
  retailer: cleanedStringSchema(20, toTitleCase),
  price: z.number().positive(),
  quantity: z.number().positive(),
  unitId: z.string().cuid(),
  pricePerUnit: z.number().positive(),
});

const editPriceHistoryValidation = z.object({
  date: z.date().optional(),
  retailer: cleanedStringSchema(20, toTitleCase).optional(),
  price: z.number().positive().optional(),
  quantity: z.number().positive().optional(),
  unitIt: z.string().cuid().optional(),
  pricePerUnit: z.number().positive().optional(),
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

export {
  createIngredientValidation,
  createPriceHistoryValidation,
  editPriceHistoryValidation,
  createExpirationRuleValidation,
};
