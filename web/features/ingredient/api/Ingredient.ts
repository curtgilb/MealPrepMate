import { graphql } from '@/gql';

const ingredientFieldsFragment = graphql(`
  fragment IngredientFields on Ingredient {
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
`);

const getIngredientQuery = graphql(`
  query GetIngredient($id: ID!) {
    ingredient(ingredientId: $id) {
      ...IngredientFields
    }
  }
`);

const getIngredientsQuery = graphql(`
  query GetIngredients($search: String, $after: String, $first: Int) {
    ingredients(search: $search, after: $after, first: $first) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          id
          name
        }
      }
    }
  }
`);

const editIngredientMutation = graphql(
  `
    mutation EditIngredient($id: ID!, $input: EditIngredientInput!) {
      editIngredient(id: $id, ingredient: $input) {
        id
      }
    }
  `
);

const createIngredientMutation = graphql(`
  mutation CreateIngredient($input: CreateIngredientInput!) {
    createIngredient(ingredient: $input) {
      id
      name
    }
  }
`);

const deleteIngredientMutation = graphql(`
  mutation deleteIngredient($id: ID!) {
    deleteIngredient(ingredientId: $id) {
      message
      success
    }
  }
`);

export {
  ingredientFieldsFragment,
  getIngredientQuery,
  editIngredientMutation,
  createIngredientMutation,
  deleteIngredientMutation,
  getIngredientsQuery,
};
