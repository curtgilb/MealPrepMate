import { RecipeSearchFieldsFragment, SearchRecipesQuery } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

type SearchRecipeAggregateLabel = RecipeSearchFieldsFragment["aggregateLabel"];

interface MacroCardDisplayProps extends HTMLAttributes<HTMLUListElement> {
  label: SearchRecipeAggregateLabel;
}

function getPerServingValue(
  macro: number | null | undefined,
  servings: number
) {
  if (!macro) return 0;
  return Math.round(macro / servings);
}

export function MacroCardDisplay({
  label,
  className,
  ...rest
}: MacroCardDisplayProps) {
  const numOfServings = label?.servings ? label.servings : 1;
  return (
    <ul
      className={cn("flex justify-between text-sm gap-2", className)}
      {...rest}
    >
      <li className="text-center">
        <p className="font-medium text-center">
          {getPerServingValue(label?.totalCalories, numOfServings)}
        </p>
        <p className="text-xs font-extralight">Calories</p>
      </li>
      <li>
        <p className="font-medium text-center">
          {getPerServingValue(label?.carbs, numOfServings)} g
        </p>
        <p className="text-xs font-extralight text-center">Carbs</p>
      </li>
      <li>
        <p className="font-medium text-center">
          {getPerServingValue(label?.fat, numOfServings)} g
        </p>
        <p className="text-xs font-extralight text-center">Fat</p>
      </li>
      <li>
        <p className="font-medium text-center">
          {getPerServingValue(label?.protein, numOfServings)} g
        </p>
        <p className="text-xs font-extralight text-center">Protein</p>
      </li>
    </ul>
  );
}
