import { z } from "zod";
import { RecipeInput } from "../types/gql.js";
import { toTitleCase } from "../util/utils.js";



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

const schemaForType =
  <T>() =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <S extends z.ZodType<T, any, any>>(arg: S) => {
    return arg;
  };

const max25string = 

// creating a schema for strings
const RecipeInputValidation = schemaForType<RecipeInput>()(
  z.object({
    title: z
      .string()
      .transform((val) => cleanString(val, toTitleCase))
      .pipe(z.string().min(1).max(100)),
    source: z
      .string()
      .transform((val) => cleanString(val))
      .pipe(z.string().min(1).max(30).nullable().optional()),
    prepTime: z.number().int().positive().nullable().optional(),
    cookTime: z.number().int().positive().nullable().optional(),
    marinadeTime: z.number().int().positive().nullable().optional(),
    directions: z.string().trim().nullable().optional(),
    notes: z.string().trim().nullable().optional(),
    stars: z.number().int().min(0).max(5).nullable().optional(),
    isFavorite: z.boolean().optional(),
    leftoverFridgeLife: z.number().int().positive().nullable().optional(),
    leftoverFreezerLife: z.number().int().positive().nullable().optional(),
    ingredients: z.string().trim().min(1).nullable().optional(),
    cuisineId: z.string().cuid().nullable().optional(),
    categoryIds: z.string().cuid().array().nullable().optional(),
    courseIds: z.string().cuid().array().nullable().optional(),
    photoIds: z.string().cuid().array().nullable().optional(),
  })
);

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
  RecipeFilterValidation,
  RecipeInputValidation,
};
