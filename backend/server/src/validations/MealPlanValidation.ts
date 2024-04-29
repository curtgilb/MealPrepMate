import { Meal } from "@prisma/client";
import { z } from "zod";
import { cleanedStringSchema } from "./utilValidations.js";
import { toTitleCase } from "../util/utils.js";

const editMealPlanValidation = z.object({
  id: z.string().cuid(),
  name: cleanedStringSchema(20, toTitleCase).optional().nullish(),
  mealPrepInstructions: z.string().optional().nullish(),
});

const editMealPlanRecipeValidation = z.object({
  factor: z.number().positive().optional(),
  servings: z.number().gte(1).optional(),
});

const addRecipeServingValidation = z.object({
  day: z.number().gte(1),
  mealPlanRecipeId: z.string().cuid(),
  mealPlanId: z.string().cuid(),
  servings: z.number().positive(),
  meal: z.nativeEnum(Meal),
});

const editRecipeServingValidation = z.object({
  id: z.string().cuid(),
  day: z.number().gte(1),
  servings: z.number().positive(),
  meal: z.nativeEnum(Meal),
});

const addRecipeToMealPlanValidation = z.object({
  mealPlanId: z.string().cuid(),
  recipeId: z.string().cuid(),
  scaleFactor: z.number().gte(1),
  servings: z.number().positive(),
  cookDay: z.number().optional(),
});

export {
  editMealPlanValidation,
  editMealPlanRecipeValidation,
  addRecipeServingValidation,
  editRecipeServingValidation,
  addRecipeToMealPlanValidation,
};
