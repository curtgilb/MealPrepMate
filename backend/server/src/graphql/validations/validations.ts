import { z, ZodError } from "zod";
import { RecipeInput, NumericalComparison } from "../../types/gql.js";
import { toTitleCase } from "../../util/utils.js";

function cleanString(value: string, format?: (val: string) => string): string {
  let cleanedString = value.trim().replace(/\s\s+/g, " ");
  if (format) cleanedString = format(cleanedString);
  return cleanedString;
}

const schemaForType =
  <T>() =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <S extends z.ZodType<T, any, any>>(arg: S) => {
    return arg;
  };

// creating a schema for strings
export const recipeInputValidation = schemaForType<RecipeInput>()(
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

const test = {
  gte: 5,
  lte: 2,
};
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

const nutritionFilterValidation = z.object({
  nutrientID: z.string().uuid(),
  perServing: z.boolean(),
  target: numericalComparisonValidation,
});

const ingredientFilterValidation = z.object({
  ingredientID: z.string().cuid(),
  perServing: z.boolean(),
  target: numericalComparisonValidation,
});

const recipeFilterValidation = z.object({
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
  nutrientFilters: nutritionFilterValidation.array().optional(),
  ingredientFilter: ingredientFilterValidation.array().optional(),
});

const result = numericalComparisonValidation.parse(test);

console.log(result.eq);
