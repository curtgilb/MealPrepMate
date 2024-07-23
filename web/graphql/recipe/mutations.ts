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

const createIngredientGroup = graphql(`
  mutation createIngredientGroup() {

  }`);

const removeIngredientGroup = graphql(`
  mutation createIngredientGroup() {

  }`);

const editRecipeIngredient = graphql(``);

// ================================================

const addRecipeIngredient = graphql(`
  mutation addRecipeIngredient() {
    addRecipeIngredient {
      ...RecipeIngredientFragment
    }
  }
  `);

const removeRecipeIngredient = graphql(``);
