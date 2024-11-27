import { graphql } from "@/gql";

const mealPlanRecipeFragment = graphql(`
  fragment MealPlanRecipeFields on MealPlanRecipe {
    id
    totalServings
    mealPlan {
      id
    }
    factor
    servingsOnPlan
    originalRecipe {
      id
      name
      directions
      notes
      source
      leftoverFridgeLife
      leftoverFreezerLife
      prepTime
      marinadeTime
      cookTime
      photos {
        id
        url
        isPrimary
      }
      ingredientFreshness
      ingredients {
        ...RecipeIngredientFields
      }
      aggregateLabel {
        id
        totalCalories
        fat
        alcohol
        carbs
        protein
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

const planNutritionFragment = graphql(`
  fragment PlanNutritionFields on MealPlanRecipe {
    id
    totalServings
    mealPlan {
      id
    }
    factor
    originalRecipe {
      id
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
      }
    }
  }
`);

const getMealPlanRecipes = graphql(`
  query GetMealPlanRecipes($mealPlanId: ID!) {
    mealPlanRecipes(mealPlanId: $mealPlanId) {
      ...MealPlanRecipeFields
    }
  }
`);

const getMealPlanRecipeNutrition = graphql(`
  query GetMealPlanRecipeNutrition($mealPlanRecipeId: ID!) {
    mealPlanRecipes(mealPlanId: $mealPlanRecipeId) {
      ...PlanNutritionFields
    }
  }
`);

const addRecipeToMealPlanMutation = graphql(`
  mutation addRecipeToPlan($mealPlanId: ID!, $recipe: AddRecipeToPlanInput!) {
    addRecipeToMealPlan(mealPlanId: $mealPlanId, recipe: $recipe) {
      mealPlan {
        id
      }
      ...MealPlanRecipeFields
    }
  }
`);

const editMealPlanRecipeMutation = graphql(`
  mutation editMealPlanRecipe($id: ID!, $recipe: EditMealPlanRecipeInput!) {
    editMealPlanRecipe(id: $id, recipe: $recipe) {
      ...MealPlanRecipeFields
    }
  }
`);

const deleteMealPlanRecipeMutation = graphql(`
  mutation removeMealPlanRecipe($id: ID!) {
    removeMealPlanRecipe(id: $id) {
      id
      success
    }
  }
`);

export {
  mealPlanRecipeFragment,
  addRecipeToMealPlanMutation,
  getMealPlanRecipes,
  editMealPlanRecipeMutation,
  deleteMealPlanRecipeMutation,
  planNutritionFragment,
  getMealPlanRecipeNutrition,
};
