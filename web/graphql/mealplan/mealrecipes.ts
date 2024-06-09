import { graphql } from "@/gql";

export const mealRecipeFragment = graphql(`
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
