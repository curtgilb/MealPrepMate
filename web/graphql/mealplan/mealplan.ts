import { graphql } from "@/gql";

export const mealPlanQuery = graphql(`
  query GetMealPlan($mealPlanId: String!) {
    mealPlan(id: $mealPlanId) {
      id
      name
      mealPrepInstructions
      mealPlanServings {
        ...MealPlanServingsField
      }
      planRecipes {
        ...MealRecipeFields
      }
    }
  }
`);
