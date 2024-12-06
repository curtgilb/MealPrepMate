import { db } from '@/infrastructure/repository/db.js';
import { Meal, Prisma } from '@prisma/client';

type AddRecipeServingInput = {
  day: number;
  mealPlanRecipeId: string;
  mealPlanId: string;
  servings: number;
  meal: Meal;
};

type EditRecipeServingInput = {
  day: number;
  servings: number;
  meal: Meal;
};

type MealPlanServingQuery = {
  include?: Prisma.MealPlanServingInclude | undefined;
  select?: Prisma.MealPlanServingSelect | undefined;
};

type ServingsFilterInput = {
  day?: number | null;
  minDay?: number | null;
  maxDay?: number | null;
};

async function getMealPlanServings(
  mealPlanId: string,
  filter: ServingsFilterInput | null | undefined,
  query?: MealPlanServingQuery
) {
  // @ts-ignore
  return await db.mealPlanServing.findMany({
    // @ts-ignore
    where: {
      mealPlan: { id: mealPlanId },
      day: {
        equals: filter?.day ?? undefined,
        lte: filter?.maxDay ?? undefined,
        gte: filter?.minDay ?? undefined,
      },
    },
    ...query,
  });
}

async function addServingToPlan(
  serving: AddRecipeServingInput,
  query?: MealPlanServingQuery
) {
  return await db.mealPlanServing.create({
    data: {
      day: serving.day,
      meal: serving.meal,
      numberOfServings: serving.servings,
      mealPlan: {
        connect: { id: serving.mealPlanId },
      },
      recipe: {
        connect: { id: serving.mealPlanRecipeId },
      },
    },
    ...query,
  });
}

async function editMealPlanServing(
  id: string,
  serving: EditRecipeServingInput,
  query?: MealPlanServingQuery
) {
  if (serving.servings) {
    const mealRecipe = await db.mealPlanServing.findUniqueOrThrow({
      where: { id: id },
      select: { mealPlanRecipeId: true },
    });
    await canChangeServings(mealRecipe.mealPlanRecipeId, serving.servings, id);
  }
  await db.mealPlanServing.update({
    where: { id: id },
    data: {
      day: serving.day,
      meal: serving.meal,
      numberOfServings: serving.servings ?? undefined,
    },
  });
  return await db.mealPlanServing.findMany({ ...query });
}

async function deleteMealPlanServing(id: string) {
  await db.mealPlanServing.delete({
    where: { id: id },
  });
}

async function canChangeServings(
  mealRecipeId: string,
  servingAmount: number,
  servingId?: string
) {
  const meal = await db.mealPlanRecipe.findUniqueOrThrow({
    where: { id: mealRecipeId },
    include: { servings: true },
  });
  let originalAmount = 0;
  const servingsAlreadyAdded =
    meal?.servings.reduce((total, serving) => {
      if (serving.id === servingId) {
        originalAmount = serving.numberOfServings;
      }
      return total + serving.numberOfServings;
    }, 0) ?? 0;

  const newServingTotal = servingsAlreadyAdded - originalAmount + servingAmount;
  if (newServingTotal > meal.totalServings) {
    throw new Error("Servings must not exceed the total available");
  }
}

export {
  AddRecipeServingInput,
  addServingToPlan,
  deleteMealPlanServing,
  editMealPlanServing,
  EditRecipeServingInput,
  getMealPlanServings,
  ServingsFilterInput,
};
