import { z } from "zod";
import { toTitleCase } from "../util/utils.js";
import { schemaForType } from "./utilValidations.js";
import { RecipeInput } from "../types/gql.js";

function cleanedStringSchema(max: number, formatter?: (val: string) => string) {
  return z
    .string()
    .transform((value) => {
      let cleanedString = value.trim().replace(/\s\s+/g, " ");
      if (formatter) cleanedString = formatter(cleanedString);
      return cleanedString;
    })
    .pipe(z.string().min(1).max(max));
}

// creating a schema for strings
const RecipeInputValidation = schemaForType<RecipeInput>()(
  z.object({
    title: cleanedStringSchema(100, toTitleCase),
    source: z.string().trim().optional(),
    prepTime: z.coerce.number().nullable().optional(),
    cookTime: z.coerce.number().nullable().optional(),
    marinadeTime: z.coerce.number().nullable().optional(),
    directions: z.string().nullish(),
    notes: z.string().nullish(),
    isFavorite: z.coerce.boolean().optional(),
    leftoverFridgeLife: z.coerce
      .number()
      .int()
      .positive()
      .nullable()
      .optional(),
    leftoverFreezerLife: z.coerce
      .number()
      .int()
      .positive()
      .nullable()
      .optional(),
    ingredients: z.string().nullish(),
    cuisineIds: z.coerce.string().cuid().array().nullable().optional(),
    categoryIds: z.coerce.string().cuid().array().nullable().optional(),
    courseIds: z.coerce.string().cuid().array().nullable().optional(),
    photoIds: z.coerce.string().cuid().array().nullable().optional(),
  })
);

const RecipeIngredientValidation = z.object({
  id: z.string().cuid().nullable().optional(),
  order: z.number().nullable().optional(),
  sentence: z.string().nullable().optional(),
  quantity: z.number().nullable().optional(),
  unitId: z.string().cuid(),
  name: z.string().nullable().optional(),
  ingredientId: z.string().cuid().nullable().optional(),
  groupName: z.string().nullable().optional(),
  groupId: z.string().cuid().nullable().optional(),
});

const RecipeIngredientUpdateValidation = z.object({
  recipeId: z.string().cuid(),
  ingredientsToAdd: RecipeIngredientValidation.array().optional().nullish(),
  ingredientsToDelete: z.string().array().optional(),
  ingredientsToUpdate: RecipeIngredientValidation.array().optional(),
  groupsToAdd: z.string().array().optional(),
  groupsToDelete: z.string().array().optional(),
});

const NutritionLabelValidation = z.object({
  name: cleanedStringSchema(100, toTitleCase),
  connectingId: z.string().cuid().optional(),
  servings: z.coerce.number().positive(),
  servingSize: z.coerce.number().positive().optional(),
  servingSizeUnitId: z.string().cuid().optional(),
  servingsUsed: z.number().optional(),
  nutrients: z.array(
    z.object({
      value: z.coerce.number(),
      nutrientId: z.string().cuid(),
    })
  ),
});

const numericalComparisonValidation = z
  .object({
    gte: z.number().int().positive().optional(),
    eq: z.number().int().positive().optional(),
    lte: z.number().int().positive().optional(),
  })
  .transform((obj) => {
    if (obj.eq) return { eq: obj.eq };
    return obj;
  });

const NutritionFilterValidation = z.object({
  nutrientID: z.string().uuid(),
  perServing: z.boolean(),
  target: numericalComparisonValidation,
});

const IngredientFilterValidation = z.object({
  ingredientID: z.string().cuid(),
  perServing: z.boolean(),
  target: numericalComparisonValidation,
});

const RecipeFilterValidation = z.object({
  searchString: z.string().optional(),
  numOfServings: numericalComparisonValidation.optional(),
  courseIds: z.string().cuid().array().optional(),
  cuisineIds: z.string().cuid().array().optional(),
  categoryIds: z.string().cuid().array().optional(),
  prepTime: numericalComparisonValidation.optional(),
  cookTime: numericalComparisonValidation.optional(),
  marinadeTime: numericalComparisonValidation.optional(),
  totalPrepTime: numericalComparisonValidation.optional(),
  isFavorite: z.boolean().optional(),
  nutrientFilters: NutritionFilterValidation.array().optional(),
  ingredientFilter: IngredientFilterValidation.array().optional(),
  ingredientFreshDays: numericalComparisonValidation.optional(),
  recipePrice: numericalComparisonValidation.optional(),
});

export {
  cleanedStringSchema,
  NutritionFilterValidation,
  NutritionLabelValidation,
  RecipeFilterValidation,
  RecipeIngredientUpdateValidation,
  RecipeIngredientValidation,
  RecipeInputValidation,
};
