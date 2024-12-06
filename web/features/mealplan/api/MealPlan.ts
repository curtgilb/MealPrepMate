import { graphql } from '@/gql';

const mealRecipeFragment = graphql(`
  fragment MealRecipeFields on MealPlanRecipe {
    id
    totalServings
    factor
    servingsOnPlan
    originalRecipe {
      id
      name
      photos {
        id
        url
        isPrimary
      }
      ingredientFreshness
      ingredients {
        id
        quantity
        sentence
        baseIngredient {
          id
          name
        }
        unit {
          id
          name
          symbol
        }
      }
      aggregateLabel {
        id
        totalCalories
        fat
        alcohol
        carbs
        protein
        nutrients {
          id
          perServing
          value
          nutrient {
            id
          }
        }
        servings
        servingSize
        servingSizeUnit {
          id
          name
          symbol
        }
      }
    }
  }
`);

export const mealPlanQuery = graphql(`
  query GetMealPlan($mealPlanId: ID!) {
    mealPlan(id: $mealPlanId) {
      id
      name
      mealPrepInstructions
    }
  }
`);

export const mealPlanInfoQuery = graphql(`
  query GetMealPlanInfo($mealPlanId: ID!) {
    mealPlan(id: $mealPlanId) {
      id
      name
      mealPrepInstructions
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
      mealPrepInstructions
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
              id
              name
              photos {
                id
                url
                isPrimary
              }
            }
          }
        }
      }
    }
  }
`);

export {
  createMealPlanMutation,
  getMealPlansQuery,
  editMealPlanMutation,
  mealRecipeFragment,
};
