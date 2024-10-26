"use client";
import { ParseIngredients } from "@/features/recipe/components/edit/info/ingredients/ParseIngredients";
import { VerifyIngredients } from "@/features/recipe/components/edit/info/ingredients/VerifyIngredients";
import { ParseIngredientsQuery, RecipeFieldsFragment } from "@/gql/graphql";

import { useState } from "react";

interface EditIngredientsProps {
  ingredients: RecipeFieldsFragment["ingredients"] | null | undefined;
}

export function EditIngredients({ ingredients }: EditIngredientsProps) {
  const [parsedIngredients, setParsedIngredients] =
    useState<ParseIngredientsQuery["tagIngredients"]>(undefined);
  let activeIngredients = ingredients ? ingredients : parsedIngredients;

  function handleParsedIngredients(
    parsedIngredients: ParseIngredientsQuery["tagIngredients"]
  ) {
    setParsedIngredients(parsedIngredients);
  }

  if (!activeIngredients) {
    return <ParseIngredients updateIngredients={handleParsedIngredients} />;
  }

  return (
    <VerifyIngredients ingredients={activeIngredients}></VerifyIngredients>
  );
}
