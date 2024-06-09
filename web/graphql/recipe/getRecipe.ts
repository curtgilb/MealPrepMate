import { graphql } from "@/gql";

export const getRecipeQuery = graphql(`
  query getRecipe($id: String!) {
    recipe(recipeId: $id) {
      id
      name
      category {
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
      totalTime
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
    }
  }
`);

export const recipeSearchFragment = graphql(`
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

export const searchRecipes = graphql(`
  query searchRecipes($filters: RecipeFilter, $pagination: OffsetPagination!) {
    recipes(filter: $filters, pagination: $pagination) {
      itemsRemaining
      nextOffset
      recipes {
        ...RecipeSearchFields
      }
    }
  }
`);
