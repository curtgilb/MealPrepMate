import { graphql } from "@/gql";

const RecipeIngredientFragment = graphql(`
  fragment RecipeIngredientFields on RecipeIngredients {
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
        ...RecipeIngredientFields
      }
    }
  }
`);

const createRecipeIngredientMutation = graphql(`
  mutation createRecipeIngredient($recipeId: String!, $txt: String!) {
    addRecipeIngredient(recipeId: $recipeId, ingredientTxt: $txt) {
      ...RecipeIngredientFields
    }
  }
`);

const editRecipeIngredientMutation = graphql(`
  mutation editRecipeIngredient($ingredients: [RecipeIngredientInput!]!) {
    editRecipeIngredients(ingredients: $ingredients) {
      ...RecipeIngredientFields
    }
  }
`);

const deleteRecipeIngredientMutation = graphql(`
  mutation deleteRecipeIngredient($id: String!) {
    deleteRecipeIngredients(ingredientId: $id) {
      success
    }
  }
`);

export {
  RecipeIngredientFragment,
  getRecipeIngredients,
  deleteRecipeIngredientMutation,
  createRecipeIngredientMutation,
  editRecipeIngredientMutation,
};
