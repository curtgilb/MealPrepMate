import { graphql } from "@/gql";

const getRecipeQuery = graphql(`
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
          perServing
          nutrient {
            id
          }
        }
      }
    }
  }
`);

// const createRecipeMutation = graphql(`
// mutation createRecipe()
//   `);

const getRecipeBaiscInfo = graphql(`
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

const getRecipeLabels = graphql(`
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

const searchRecipes = graphql(`
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

export {
  getRecipeQuery,
  getRecipeBaiscInfo,
  getRecipeLabels,
  recipeSearchFragment,
  searchRecipes,
};
