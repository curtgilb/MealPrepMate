"use client";
import { Suspense } from "react";
import { useQuery, gql } from "@urql/next";
import { graphql } from "@/gql";
import RecipeIngredientEdit from "@/components/recipe/RecipeIngredients";

const fetchRecipe = graphql(/* GraphQL */ `
  query fetchRecipe($id: String!) {
    recipe(recipeId: $id) {
      id
      ingredients {
        ...RecipeIngredientFragment
      }
    }
  }
`);

export default function RecipeEdit() {
  const [result] = useQuery({
    query: fetchRecipe,
    variables: { id: "cltus93fj000008jq4rh9fnod" },
  });
  const { data, fetching, error } = result;
  data?.recipe.ingredients.map((ingredient) => {});
  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  return (
    <Suspense>
      <h1>Edit Recipe</h1>
      <RecipeIngredientEdit ingredients={data?.recipe.ingredients} />
    </Suspense>
  );
}
