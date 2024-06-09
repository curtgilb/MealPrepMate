import { graphql } from "@/gql";

export const mealServingsFragment = graphql(`
  fragment MealPlanServingsField on MealPlanServing {
    id
    day
    meal
    numberOfServings
    mealPlanRecipeId
  }
`);
