import { graphql } from "@/gql";

const RecipeIngredientFragment = graphql(`
  fragment RecipeIngredientFragment on RecipeIngredients {
    id
    sentence
    order
    quantity
    baseIngredient {
      id
      name
    }
    unit {
      id
      name
      symbol
    }
    group {
      id
      name
    }
  }
`);

const getRecipeIngredients = graphql(`
  query getRecipeIngredients($id: String!) {
    recipe(recipeId: $id) {
      id
      ingredients {
        ...RecipeIngredientFragment
      }
    }
  }
`);

const deleteRecipeIngredientMutation = graphql(`
  mutation deleteRecipeIngredient($id: String!) {
    deleteRecipeIngredientGroup(groupId: $id) {
      success
    }
  }
`);

export {
  RecipeIngredientFragment,
  getRecipeIngredients,
  deleteRecipeIngredientMutation,
};
