import { graphql } from "@/gql";

const getIngredientQuery = graphql(`
  query GetIngredient($id: String!) {
    ingredient(ingredientId: $id) {
      id
      name
      alternateNames
      storageInstructions
      category {
        id
        name
      }
      expiration {
        ...ExpirationRuleFields
      }
      priceHistory {
        id
        date
        foodType
        groceryStore {
          id
          name
        }
        price
        pricePerUnit
        quantity
        unit {
          id
          name
          symbol
          conversionName
          measurementSystem
          type
        }
      }
    }
  }
`);

const editIngredientMutation = graphql(
  `
    mutation EditIngredient($input: EditIngredientInput!) {
      editIngredient(ingredient: $input) {
        id
      }
    }
  `
);

const createIngredientMutation = graphql(`
  mutation CreateIngredient($input: CreateIngredientInput!) {
    createIngredient(ingredient: $input) {
      id
    }
  }
`);

const deleteIngredientMutation = graphql(`
  mutation deleteIngredient($id: String!) {
    deleteIngredient(ingredientId: $id) {
      message
      success
    }
  }
`);

export {
  getIngredientQuery,
  editIngredientMutation,
  createIngredientMutation,
  deleteIngredientMutation,
};
