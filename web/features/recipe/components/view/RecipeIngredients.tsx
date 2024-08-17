import { RecipeIngredientFragment } from "@/features/recipe/api/RecipeIngredient";
import { useGroupedIngredients } from "@/features/recipe/hooks/useGroupedIngredients";
import { FragmentType, useFragment } from "@/gql/fragment-masking";
import { RecipeIngredientFieldsFragment } from "@/gql/graphql";

import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface RecipeIngredientsProps extends HTMLAttributes<HTMLDivElement> {
  ingredients: FragmentType<typeof RecipeIngredientFragment>[];
}

export default function RecipeIngredients({
  ingredients,
  className,
  ...rest
}: RecipeIngredientsProps) {
  const ingredientList = useFragment(RecipeIngredientFragment, ingredients);
  const groupedIngredients = useGroupedIngredients(ingredientList);

  return (
    <div className={cn("flex flex-col gap-8 w-60", className)} {...rest}>
      {Object.entries(groupedIngredients).map(([groupName, group]) => {
        return (
          <div key={group.id}>
            <h3 className="font-semibold">{groupName}</h3>
            <ul className="flex-col gap-4">
              {group.lines.map((line) => {
                return (
                  <p
                    key={line.id}
                    style={{ textIndent: "-0.5rem", paddingLeft: "0.5rem" }}
                    className="text-indent"
                  >
                    {line.sentence}
                  </p>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
