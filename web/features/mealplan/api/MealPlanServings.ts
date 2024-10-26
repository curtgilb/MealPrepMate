import { graphql } from "@/gql";

const addServingMutation = graphql(`
  mutation addServingToPlan($serving: AddRecipeServingInput!) {
    addRecipeServing(serving: $serving) {
      day
      id
      meal
      mealPlanRecipeId
      numberOfServings
      mealRecipe {
        id
        servingsOnPlan
      }
    }
  }
`);

const deleteServingMutation = graphql(`
  mutation removeServing($id: ID!) {
    deleteRecipeServing(id: $id) {
      id
      success
    }
  }
`);

const editServingMutation = graphql(`
  mutation editServing($id: ID!, $serving: EditRecipeServingInput!) {
    editRecipeServing(id: $id, serving: $serving) {
      id
      day
      meal
      numberOfServings
      mealRecipe {
        id
        servingsOnPlan
      }
    }
  }
`);

export { addServingMutation, deleteServingMutation, editServingMutation };
