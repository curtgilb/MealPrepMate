import { graphql } from "@/gql";

export const RecipeIngredientFragment = graphql(`
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

export const getRecipeQuery = graphql(`
  query getRecipe($id: String!) {
    recipe(recipeId: $id) {
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
        ...RecipeIngredientFragment
      }
    }
  }
`);

export const getRecipeBaiscInfo = graphql(`
  query getRecipeBaiscInfo($id: String!) {
    recipe(recipeId: $id) {
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
    }
  }
`);

export const getRecipeIngredients = graphql(`
  query getRecipeIngredients($id: String!) {
    recipe(recipeId: $id) {
      id
      ingredients {
        ...RecipeIngredientFragment
      }
    }
  }
`);

export const getRecipeLabels = graphql(`
  query getRecipeLabels($id: String!) {
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
