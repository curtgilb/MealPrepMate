import { db } from "@/infrastructure/repository/db.js";
import { MealPlanRecipe, Prisma } from "@prisma/client";

type AddRecipeToPlanInput = {
  mealPlanId: string;
  recipeId: string;
  scaleFactor: number;
  servings: number;
};

type EditMealPlanRecipeInput = {
  factor: number;
  servings: number;
};

type MealPlanRecipeQuery = {
  include?: Prisma.MealPlanRecipeInclude | undefined;
  select?: Prisma.MealPlanRecipeSelect | undefined;
};

async function getMealPlanRecipeServings(recipe: MealPlanRecipe) {
  const result = await db.mealPlanServing.aggregate({
    where: { mealPlanId: recipe.mealPlanId, mealPlanRecipeId: recipe.id },
    _sum: {
      numberOfServings: true,
    },
  });
  return result._sum.numberOfServings ?? 0;
}

async function getMealPlanRecipes(
  mealPlanId: string,
  query?: MealPlanRecipeQuery
) {
  // @ts-ignore
  return await db.mealPlanRecipe.findMany({
    // @ts-ignore
    where: { mealPlanId: mealPlanId },
    ...query,
  });
}

async function addRecipeToPlan(
  mealPlanId: string,
  recipe: AddRecipeToPlanInput,
  query: MealPlanRecipeQuery
) {
  // @ts-ignore
  return await db.mealPlanRecipe.create({
    data: {
      mealPlan: { connect: { id: mealPlanId } },
      recipe: { connect: { id: recipe.recipeId } },
      factor: recipe.scaleFactor,
      totalServings: recipe.servings,
    },
    ...query,
  });
}

async function editRecipeOnPlan(
  id: string,
  recipe: EditMealPlanRecipeInput,
  query?: MealPlanRecipeQuery
) {
  return await db.mealPlanRecipe.update({
    where: { id: id },
    data: {
      totalServings: recipe.servings ?? undefined,
      factor: recipe.factor ?? undefined,
    },
    ...query,
  });
}

async function removeRecipeFromPlan(id: string) {
  await db.mealPlanRecipe.delete({
    where: { id: id },
  });
}

export {
  addRecipeToPlan,
  AddRecipeToPlanInput,
  EditMealPlanRecipeInput,
  editRecipeOnPlan,
  getMealPlanRecipes,
  getMealPlanRecipeServings,
  removeRecipeFromPlan,
};
