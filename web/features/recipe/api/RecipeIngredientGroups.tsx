import { graphql } from "@/gql";

const createRecipeIngredientGroupMutation = graphql(`
  mutation createIngredientGroup($name: String!, $recipeId: String!) {
    createRecipeIngredientGroup(name: $name, recipeId: $recipeId) {
      id
      name
    }
  }
`);

const deleteRecipeIngredientGroupMutation = graphql(`
  mutation deleteIngredientGroup($groupId: String!) {
    deleteRecipeIngredientGroup(groupId: $groupId) {
      success
    }
  }
`);

const editRecipeIngredientGroupMutation = graphql(`
  mutation editIngredientGroup($name: String!, $groupId: String!) {
    editRecipeIngredientGroup(name: $name, groupId: $groupId) {
      id
      name
    }
  }
`);

export {
  createRecipeIngredientGroupMutation,
  deleteRecipeIngredientGroupMutation,
  editRecipeIngredientGroupMutation,
};
