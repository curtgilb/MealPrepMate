"use client";
import { graphql } from "@/gql";
import { useState } from "react";
import { useQuery, gql } from "@urql/next";
import { EditRecipeIngredients } from "./EditRecipeIngredients";
import { EditRecipeNutritionLabels } from "./EditRecipeNutritionLabels";

export const getRecipeQuery = graphql(`
  query getRecipeToEdit($id: String!) {
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
      nutritionLabels {
        ...NutritionLabelFields
      }
    }
  }
`);

export async function EditRecipe({ id }: { id?: string }) {
  const placeholderId = id ?? "";
  const pauseQuery = id !== null || id !== undefined;
  const [result, fetch] = useQuery({
    query: getRecipeQuery,
    variables: { id: placeholderId },
    pause: pauseQuery,
  });
  const [editStage, setEditState] = useState<number>(1);

  const { data, fetching, error } = result;
  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  return (
    <div>
      {/* <EditRecipeMeta meta={recipe.ingredients}></EditRecipeMeta> */}
      <EditRecipeIngredients ingredients={data?.recipe.ingredients} />
      {/* <EditRecipeNutritionLabels labels={data?.recipe.nutritionLabels} /> */}
    </div>
  );
}
