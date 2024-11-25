import { graphql } from "@/gql";

const recipeIngredientFragment = graphql(`
  fragment RecipeIngredientFields on RecipeIngredient {
    id
    sentence
    order
    quantity
    verified
    mealPrepIngredient
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

const tagIngredientsQuery = graphql(`
  query parseIngredients($lines: String!) {
    tagIngredients(ingredientTxt: $lines) {
      order
      quantity
      sentence
      unit {
        id
        name
      }
      ingredient {
        id
        name
      }
    }
  }
`);

const getRecipeIngredients = graphql(`
  query getRecipeIngredients($id: ID!) {
    recipe(recipeId: $id) {
      id
      ingredients {
        ...RecipeIngredientFields
      }
    }
  }
`);

const createRecipeIngredientMutation = graphql(`
  mutation createRecipeIngredient($recipeId: ID!, $ingredient: String!) {
    addRecipeIngredientsFromTxt(recipeId: $recipeId, ingredients: $ingredient) {
      ...RecipeIngredientFields
    }
  }
`);

const editRecipeIngredientMutation = graphql(`
  mutation editRecipeIngredient($input: [EditRecipeIngredientsInput!]!) {
    editRecipeIngredients(ingredients: $input) {
      ...RecipeIngredientFields
    }
  }
`);

const deleteRecipeIngredientMutation = graphql(`
  mutation deleteRecipeIngredient($id: ID!) {
    deleteRecipeIngredient(ingredientId: $id) {
      success
    }
  }
`);

export {
  recipeIngredientFragment,
  getRecipeIngredients,
  deleteRecipeIngredientMutation,
  createRecipeIngredientMutation,
  editRecipeIngredientMutation,
  tagIngredientsQuery,
};
