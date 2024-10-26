import { useGroupedIngredients } from "@/features/recipe/hooks/useGroupedIngredients";
import { FragmentType, getFragmentData } from "@/gql/fragment-masking";
import { GetRecipeQuery, RecipeIngredientFieldsFragment } from "@/gql/graphql";

import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface RecipeIngredientsProps extends HTMLAttributes<HTMLDivElement> {
  ingredients: RecipeIngredientFieldsFragment[] | null | undefined;
}

export default function RecipeIngredients({
  ingredients,
  className,
  ...rest
}: RecipeIngredientsProps) {
  const groupedIngredients = useGroupedIngredients(ingredients);

  return (
    <div className={cn("flex flex-col gap-8", className)} {...rest}>
      {groupedIngredients &&
        Object.entries(groupedIngredients).map(([groupName, group]) => {
          return (
            <div key={group.id}>
              <h3 className="font-semibold">{groupName}</h3>
              <ul className="flex flex-col gap-2">
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
