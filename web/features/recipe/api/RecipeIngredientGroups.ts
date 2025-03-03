import { graphql } from "@/gql";

const createRecipeIngredientGroupMutation = graphql(`
  mutation createIngredientGroup($name: String!, $recipeId: ID!) {
    createIngredientGroup(name: $name, recipeId: $recipeId) {
      id
      name
      recipe {
        id
      }
      ingredients {
        id
      }
    }
  }
`);

const deleteRecipeIngredientGroupMutation = graphql(`
  mutation deleteIngredientGroup($groupId: ID!) {
    deleteRecipeIngredientGroup(groupId: $groupId) {
      success
    }
  }
`);

const editRecipeIngredientGroupMutation = graphql(`
  mutation editIngredientGroup($name: String!, $groupId: ID!) {
    editRecipeIngredientGroup(name: $name, groupId: $groupId) {
      id
      name
      recipe {
        id
      }
      ingredients {
        id
      }
    }
  }
`);

export {
  createRecipeIngredientGroupMutation,
  deleteRecipeIngredientGroupMutation,
  editRecipeIngredientGroupMutation,
};
