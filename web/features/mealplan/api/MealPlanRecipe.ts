import { graphql } from "@/gql";

const mealPlanRecipeFragment = graphql(`
  fragment MealPlanRecipeFields on MealPlanRecipe {
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

const addRecipeToMealPlanMutation = graphql(`
  mutation addRecipeToPlan($mealPlanId: ID!, $recipe: AddRecipeToPlanInput!) {
    addRecipeToMealPlan(mealPlanId: $mealPlanId, recipe: $recipe) {
      ...MealPlanRecipeFields
    }
  }
`);

export { mealPlanRecipeFragment, addRecipeToMealPlanMutation };
