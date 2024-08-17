import { useGroupedIngredients } from "@/features/recipe/hooks/useGroupedIngredients";
import {
  RecipeFieldsFragment,
  RecipeIngredientFieldsFragment,
} from "@/gql/graphql";
import { cn } from "@/lib/utils";
import { CircleCheck } from "lucide-react";

interface IngredientListProps {
  ingredients: RecipeIngredientFieldsFragment[] | undefined | null;
  active: string | null | undefined;
  jumpTo: (index: number) => void;
  completedIds: string[];
}

export function IngredientList({
  ingredients,
  active,
  jumpTo,
  completedIds,
}: IngredientListProps) {
  console.log(ingredients);
  const groupedIngredients = useGroupedIngredients(ingredients);

  return (
    <ol className="space-y-6">
      {groupedIngredients &&
        Object.entries(groupedIngredients).map(([name, group]) => {
          return (
            <li key={group.id}>
              <p className="text-lg font-semibold">{name ?? "Default"}</p>
              <ol>
                {group.lines.map((line) => {
                  const completed = completedIds.includes(line.id);
                  return (
                    <li
                      key={line.id}
                      className="flex items-center gap-2 hover:cursor-pointer group"
                      onClick={() => {
                        const index = ingredients?.findIndex(
                          (item) => item.id === line.id
                        );
                        console.log(index);
                        jumpTo(index ?? 0);
                      }}
                    >
                      <p
                        className={cn("group-hover:underline", {
                          completed: "text-slate-700",
                        })}
                      >
                        {line.sentence}
                      </p>
                      <CircleCheck
                        className={cn("h-4 w-4", {
                          "text-green-500": completed,
                        })}
                      />
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
