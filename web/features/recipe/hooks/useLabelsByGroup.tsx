"use client";
import { nutritionLabelFragment } from "@/features/recipe/api/NutritionLabel";
import { recipeIngredientFragment } from "@/features/recipe/api/RecipeIngredient";
import { getFragmentData } from "@/gql";
import {
  NutritionLabelFieldsFragment,
  RecipeFieldsFragment,
} from "@/gql/graphql";
import { useMemo } from "react";

export function useLabelsByGroup(
  labels: RecipeFieldsFragment["nutritionLabels"],
  ingredients: RecipeFieldsFragment["ingredients"] | undefined | null,
  selectedGroup: string
) {
  const typedIngredients = getFragmentData(
    recipeIngredientFragment,
    ingredients
  );
  const typedLabels = getFragmentData(nutritionLabelFragment, labels);
  const groupToLabel = useMemo(() => {
    const lookup = typedLabels?.reduce((agg, label) => {
      if (label?.ingredientGroup && !agg.has(label.ingredientGroup.id)) {
        agg.set(label.ingredientGroup.id, label);
      }
      return agg;
    }, new Map<string, NutritionLabelFieldsFragment | undefined>());

    // Give the default group the primary label
    lookup?.set(
      "default",
      typedLabels?.find((label) => label.isPrimary)
    );
    return lookup;
  }, [typedLabels]);

  const selectedLabel = groupToLabel?.get(selectedGroup);

  const groups = typedIngredients?.reduce((agg, ingredient) => {
    if (ingredient?.group) {
      agg.set(ingredient.group.id, ingredient.group.name);
    }
    return agg;
  }, new Map<string, string>());

  return { groups, groupToLabel, selectedLabel };
}
