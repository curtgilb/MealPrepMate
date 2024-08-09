import { graphql } from "@/gql";

const getIngredientCategoryQuery = graphql(`
  query GetIngredientCategory {
    ingredientCategories {
      id
      name
    }
  }
`);

export { getIngredientCategoryQuery };
