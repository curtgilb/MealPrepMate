"use client";
import { RecipeIngredientFragment } from "@/features/recipe/api/RecipeIngredient";
import { useFragment } from "@/gql";
import { RecipeFieldsFragment } from "@/gql/graphql";
import { useMemo } from "react";

type GroupLabel =
  | NonNullable<RecipeFieldsFragment["nutritionLabels"]>[number]
  | undefined;

export function useLabelsByGroup(
  labels: RecipeFieldsFragment["nutritionLabels"],
  ingredients: RecipeFieldsFragment["ingredients"] | undefined | null,
  selectedGroup: string
) {
  const typedIngredients = useFragment(RecipeIngredientFragment, ingredients);
  const groupToLabel = useMemo(() => {
    const lookup = labels?.reduce((agg, label) => {
      if (label?.ingredientGroup && !agg.has(label.ingredientGroup.id)) {
        agg.set(label.ingredientGroup.id, label);
      }
      return agg;
    }, new Map<string, GroupLabel>());

    // Give the default group the primary label
    lookup?.set(
      "default",
      labels?.find((label) => label.isPrimary)
    );
    return lookup;
  }, [labels]);

  const selectedLabel = groupToLabel?.get(selectedGroup);

  const groups = typedIngredients?.reduce((agg, ingredient) => {
    if (ingredient?.group) {
      agg.set(ingredient.group.id, ingredient.group.name);
    }
    return agg;
  }, new Map<string, string>());

  return { groups, groupToLabel, selectedLabel };
}
