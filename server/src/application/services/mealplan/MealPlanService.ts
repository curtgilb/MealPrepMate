import { AllowUndefinedOrNull } from "@/application/types/CustomTypes.js";
import { db } from "@/infrastructure/repository/db.js";
import { Prisma } from "@prisma/client";

type MealPlanQuery = {
  include?: Prisma.MealPlanInclude | undefined;
  select?: Prisma.MealPlanSelect | undefined;
};

type CreateMealPlanInput = {
  name: string;
  mealPrepInstructions?: string | null | undefined;
  shoppingDays?: number[] | undefined | null;
};

type EditMealPlanInput = Partial<AllowUndefinedOrNull<CreateMealPlanInput>>;

async function getMealPlan(id: string, query?: MealPlanQuery) {
  // @ts-ignore
  return await db.mealPlan.findUniqueOrThrow({
    // @ts-ignore
    where: { id: id },
    ...query,
  });
}

async function getMealPlans(query?: MealPlanQuery) {
  return await db.mealPlan.findMany({ ...query });
}

async function createMealPlan(
  mealPlanInput: CreateMealPlanInput,
  query?: MealPlanQuery
) {
  return await db.mealPlan.create({
    data: {
      name: mealPlanInput.name,
      mealPrepInstructions: mealPlanInput.mealPrepInstructions,
      shoppingDays: mealPlanInput.shoppingDays ?? undefined,
    },
    ...query,
  });
}

async function editMealPlan(
  mealPlanId: string,
  mealPlan: EditMealPlanInput,
  query?: MealPlanQuery
) {
  return await db.mealPlan.update({
    where: { id: mealPlanId },
    data: {
      name: mealPlan.name ?? undefined,
      mealPrepInstructions: mealPlan.mealPrepInstructions,
      shoppingDays: mealPlan.shoppingDays ?? undefined,
    },
    ...query,
  });
}

async function deleteMealPlan(mealPlanId: string) {}

export {
  createMealPlan,
  CreateMealPlanInput,
  deleteMealPlan,
  editMealPlan,
  EditMealPlanInput,
  getMealPlan,
  getMealPlans,
};
