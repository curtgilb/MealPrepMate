import { Prisma } from "@prisma/client";
import { RECIPE_ID as GyroId } from "./ChickenGyroRecipe.js";
import { RECIPE_ID as HalalId } from "./HalalChickenRecipe.js";
import { DateTime } from "luxon";

const MEAL_PLAN_ID = "cltuw2iyg000008l53viu2w53";

const mealPlanCreateStmt: Prisma.MealPlanCreateInput = {
  id: MEAL_PLAN_ID,
  name: "Chicken all week long",
  mealPrepInstructions: "Cook and freeze the chicken",
  shoppingDays: [1, 4],
  planRecipes: {
    create: [
      {
        recipeId: GyroId,
        factor: 1.5,
        totalServings: 9,
        cookDayOffset: -1,
        servings: {
          createMany: {
            data: [
              {
                day: 1,
                meal: "BREAKFAST",
                mealPlanId: MEAL_PLAN_ID,
                numberOfServings: 1,
              },
              {
                day: 1,
                meal: "LUNCH",
                mealPlanId: MEAL_PLAN_ID,
                numberOfServings: 1,
              },
              {
                day: 1,
                meal: "DINNER",
                mealPlanId: MEAL_PLAN_ID,
                numberOfServings: 1,
              },
              {
                day: 2,
                meal: "BREAKFAST",
                mealPlanId: MEAL_PLAN_ID,
                numberOfServings: 1,
              },
              {
                day: 2,
                meal: "LUNCH",
                mealPlanId: MEAL_PLAN_ID,
                numberOfServings: 1,
              },
              {
                day: 2,
                meal: "DINNER",
                mealPlanId: MEAL_PLAN_ID,
                numberOfServings: 1,
              },
              {
                day: 3,
                meal: "BREAKFAST",
                mealPlanId: MEAL_PLAN_ID,
                numberOfServings: 1,
              },
              {
                day: 3,
                meal: "LUNCH",
                mealPlanId: MEAL_PLAN_ID,
                numberOfServings: 1,
              },
              {
                day: 3,
                meal: "DINNER",
                mealPlanId: MEAL_PLAN_ID,
                numberOfServings: 1,
              },
            ],
          },
        },
      },
      {
        recipeId: HalalId,
        factor: 2,
        totalServings: 8,
        cookDayOffset: -4,
        servings: {
          createMany: {
            data: [
              {
                day: 4,
                meal: "BREAKFAST",
                mealPlanId: MEAL_PLAN_ID,
                numberOfServings: 1,
              },
              {
                day: 4,
                meal: "LUNCH",
                mealPlanId: MEAL_PLAN_ID,
                numberOfServings: 1,
              },
              {
                day: 4,
                meal: "DINNER",
                mealPlanId: MEAL_PLAN_ID,
                numberOfServings: 1,
              },
              {
                day: 5,
                meal: "DINNER",
                mealPlanId: MEAL_PLAN_ID,
                numberOfServings: 1,
              },
              {
                day: 6,
                meal: "DINNER",
                mealPlanId: MEAL_PLAN_ID,
                numberOfServings: 1,
              },
              {
                day: 7,
                meal: "DINNER",
                mealPlanId: MEAL_PLAN_ID,
                numberOfServings: 3,
              },
            ],
          },
        },
      },
    ],
  },
};

const mealPlanRecipe = Prisma.validator<Prisma.MealPlanRecipeDefaultArgs>()({
  include: {
    servings: true,
    recipe: true,
  },
});

type MealPlanRecipeWithServing = Prisma.MealPlanRecipeGetPayload<
  typeof mealPlanRecipe
>;

function createScheduledInstance(
  date: DateTime,
  shoppingDays: number[],
  mealPlanRecipes: MealPlanRecipeWithServing[]
): Prisma.ScheduledPlanCreateInput {
  return {
    startDate: date.toString(),
    duration: 7,
    mealPlan: { connect: { id: MEAL_PLAN_ID } },
    shoppingDays: shoppingDays,
    recipes: mealPlanRecipes,
  };
}

export {
  mealPlanCreateStmt,
  createScheduledInstance,
  MealPlanRecipeWithServing,
};
