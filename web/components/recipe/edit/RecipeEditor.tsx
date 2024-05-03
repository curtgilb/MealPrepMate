"use client";
import { getRecipeQuery } from "@/graphql/recipe/getRecipe";
import { useQuery } from "@urql/next";
import { useState } from "react";
import { EditRecipeInfo } from "./EditRecipeInfo";

export function RecipeEditor({ id }: { id?: string }) {
  const placeholderId = id ?? "";
  const shouldPause = id === null || id === undefined;
  const [stage, setStage] = useState<number>(0);

  const [result, fetch] = useQuery({
    query: getRecipeQuery,
    variables: { id: placeholderId },
    pause: shouldPause,
  });
  const { data, fetching, error } = result;
  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  return <div>{data && <EditRecipeInfo recipe={data.recipe} />}</div>;
}
