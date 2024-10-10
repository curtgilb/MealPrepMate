import { AllowUndefinedOrNull } from "@/application/services/recipe/RecipeService.js";
import { Prisma } from "@prisma/client";

type MealPlanQuery = {
  include?: Prisma.MealPlanInclude | undefined;
  select?: Prisma.MealPlanSelect | undefined;
};

type CreateMealPlanInput = {
  name: string;
  mealPrepInstructions?: string | null | undefined;
};

type EditMealPlanInput = Partial<AllowUndefinedOrNull<CreateMealPlanInput>>;

async function createMealPlan(
  mealPlanInput: CreateMealPlanInput,
  query?: MealPlanQuery
) {}
