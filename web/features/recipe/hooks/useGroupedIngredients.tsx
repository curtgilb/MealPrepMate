import { RecipeIngredientFieldsFragment } from "@/gql/graphql";
import { useMemo } from "react";

type GroupedIngredient = {
  [key: string]: { id: string; lines: RecipeIngredientFieldsFragment[] };
};

export function useGroupedIngredients(
  ingredients: RecipeIngredientFieldsFragment[] | undefined
) {
  return useMemo(() => {
    return ingredients?.reduce((agg, ingredient) => {
      const id = ingredient.group?.id ?? "";
      const group = ingredient.group?.name ?? "";
      if (!(group in agg)) {
        agg[group] = { id, lines: [] };
      }
      agg[group].lines.push(ingredient);

      return agg;
    }, {} as GroupedIngredient);
  }, [ingredients]);
}
