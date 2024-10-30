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

// const createRecipeIngredientMutation = graphql(`
//   mutation createRecipeIngredient(
//     $recipeId: ID!
//     $ingredient: CreateRecipeIngredientInput!
//   ) {
//     addRecipeIngredient(recipeId: $recipeId, ingredient: $ingredient) {
//       ...RecipeIngredientFields
//     }
//   }
// `);

const createRecipeIngredientMutation = graphql(`
  mutation createRecipeIngredient($recipeId: ID!, $ingredient: String!) {
    addRecipeIngredientsFromTxt(recipeId: $recipeId, ingredients: $ingredient) {
      ...RecipeIngredientFields
    }
  }
`);

const editRecipeIngredientMutation = graphql(`
  mutation editRecipeIngredient($ingredient: EditRecipeIngredientInput!) {
    editRecipeIngredients(ingredient: $ingredient) {
      ...RecipeIngredientFields
    }
  }
`);

const deleteRecipeIngredientMutation = graphql(`
  mutation deleteRecipeIngredient($id: ID!) {
    deleteRecipeIngredients(ingredientId: $id) {
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
