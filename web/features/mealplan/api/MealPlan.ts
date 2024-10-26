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
        ...MealPlanRecipeFields
      }
    }
  }
`);

const createMealPlanMutation = graphql(`
  mutation createMealPlan($input: CreateMealPlanInput!) {
    createMealPlan(mealPlan: $input) {
      id
    }
  }
`);

const editMealPlanMutation = graphql(`
  mutation editMealPlan($id: ID!, $mealPlan: EditMealPlanInput!) {
    editMealPlan(id: $id, mealPlan: $mealPlan) {
      id
      name
    }
  }
`);

const getMealPlansQuery = graphql(`
  query GetMealPlans {
    mealPlans {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          name
          planRecipes {
            id
            originalRecipe {
              photos {
                id
                url
              }
            }
          }
        }
      }
    }
  }
`);

export { createMealPlanMutation, getMealPlansQuery };
