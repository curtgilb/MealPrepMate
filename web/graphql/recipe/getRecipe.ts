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
      verifed
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
