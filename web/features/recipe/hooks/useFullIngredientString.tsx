import { RecipeIngredientFieldsFragment } from "@/gql/graphql";
import { useMemo } from "react";

export function useFullIngredientString(
  ingredients: RecipeIngredientFieldsFragment[] | undefined | null
) {
  return useMemo(() => {
    const ingredientList = ingredients
      ?.sort((i1, i2) => i1.order - i2.order)
      .reduce((agg, ingredient) => {
        agg.push(ingredient.sentence);
        return agg;
      }, [] as string[]);

    return ingredientList?.join("\n");
  }, [ingredients]);
}
