import { graphql } from "@/gql";

const editRecipeIngredientMatches = graphql(`
  mutation editRecipeIngredientMatches(
    $ingredients: [RecipeIngredientInput!]!
  ) {
    editRecipeIngredients(ingredients: $ingredients) {
      ...RecipeIngredientFragment
    }
  }
`);
