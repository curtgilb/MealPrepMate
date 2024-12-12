import { graphql } from "@/gql";

const recipeFragment = graphql(`
  fragment RecipeFields on Recipe {
    id
    name
    category {
      id
      name
    }
    cuisine {
      id
      name
    }
    cookTime
    course {
      id
      name
    }
    directions
    leftoverFridgeLife
    leftoverFreezerLife
    marinadeTime
    ingredientText
    verified
    notes
    photos {
      id
      isPrimary
      url
    }
    prepTime
    source
    ingredients {
      ...RecipeIngredientFields
    }
    nutritionLabels {
      ...NutritionLabelFields
    }
    aggregateLabel {
      id
      alcohol
      servings
      totalCalories
      carbs
      fat
      protein
      servingSize
      servingSizeUnit {
        id
        name
        symbol
      }
      nutrients {
        id
        value
        nutrient {
          id
        }
      }
    }
  }
`);

const createRecipeMutation = graphql(`
  mutation createRecipe($input: RecipeInput!) {
    createRecipe(recipe: $input) {
      ...RecipeFields
    }
  }
`);

const getRecipeQuery = graphql(`
  query getRecipe($id: ID!) {
    recipe(recipeId: $id) {
      ...RecipeFields
    }
  }
`);

const editRecipeMutation = graphql(`
  mutation editRecipe($recipe: RecipeInput!, $id: ID!) {
    editRecipe(recipeId: $id, recipe: $recipe) {
      ...RecipeFields
    }
  }
`);

const getRecipeBaiscInfo = graphql(`
  query getRecipeBaiscInfo($id: ID!) {
    recipe(recipeId: $id) {
      id
      name
      cookTime
      directions
      leftoverFridgeLife
      leftoverFreezerLife
      marinadeTime
      verified
      ingredients {
        ...RecipeIngredientFields
      }
      notes
      photos {
        id
        isPrimary
        url
      }
      aggregateLabel {
        id
        servings
        totalCalories
        protein
        fat
        carbs
        alcohol
      }
      prepTime
      source
    }
  }
`);

const getRecipeLabels = graphql(`
  query getRecipeLabels($id: ID!) {
    recipe(recipeId: $id) {
      id
      nutritionLabels {
        id
        ingredientGroup {
          id
          name
        }
        isPrimary
        servingSize
        servingSizeUnit {
          id
          name
          symbol
        }
        servings
        servingsUsed
        nutrients {
          value
          nutrient {
            id
          }
        }
      }
    }
  }
`);

const recipeSearchFragment = graphql(`
  fragment RecipeSearchFields on Recipe {
    id
    name
    verified
    ingredients {
      id
      sentence
      quantity
      unit {
        id
        name
      }
    }
    aggregateLabel {
      id
      totalCalories
      protein
      fat
      carbs
      alcohol
      servings
    }
    photos {
      id
      isPrimary
      url
    }
  }
`);

const searchRecipesQuery = graphql(`
  query searchRecipes($filters: RecipeFilter!, $after: String, $first: Int) {
    recipes(filter: $filters, after: $after, first: $first) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        cursor
        node {
          ...RecipeSearchFields
        }
      }
    }
  }
`);

export {
  createRecipeMutation,
  getRecipeQuery,
  getRecipeBaiscInfo,
  getRecipeLabels,
  recipeSearchFragment,
  searchRecipesQuery,
  recipeFragment,
  editRecipeMutation,
};
