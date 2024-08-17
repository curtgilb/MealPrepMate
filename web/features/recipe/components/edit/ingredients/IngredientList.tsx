import { useGroupedIngredients } from "@/features/recipe/hooks/useGroupedIngredients";
import {
  RecipeFieldsFragment,
  RecipeIngredientFieldsFragment,
} from "@/gql/graphql";
import { CircleCheck } from "lucide-react";

interface IngredientListProps {
  ingredients: RecipeIngredientFieldsFragment[] | undefined;
  active: string;
  jumpTo: (id: string) => void;
  completedIds: string[];
}

export function IngredientList({
  ingredients,
  active,
  jumpTo,
  completedIds,
}: IngredientListProps) {
  const groupedIngredients = useGroupedIngredients(ingredients);

  return (
    <ol>
      {groupedIngredients &&
        Object.entries(groupedIngredients).map(([name, group]) => {
          return (
            <li key={group.id}>
              <ol>
                {group.lines.map((line) => {
                  const completed = completedIds.includes(line.id);
                  return (
                    <li key={line.id} className="flex items-center gap-2">
                      <p>{line.sentence}</p>
                      <CircleCheck className="h-4 w-4" />
                    </li>
                  );
                })}
              </ol>
            </li>
          );
        })}
    </ol>
  );
}
