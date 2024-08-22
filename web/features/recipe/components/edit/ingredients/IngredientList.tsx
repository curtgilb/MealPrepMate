import { useGroupedIngredients } from "@/features/recipe/hooks/useGroupedIngredients";
import { RecipeIngredientFieldsFragment } from "@/gql/graphql";
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
    <ol className="space-y-6 max-w-72">
      {groupedIngredients &&
        Object.entries(groupedIngredients).map(([name, group]) => {
          return (
            <li key={group.id}>
              <p className="font-medium">{name ?? "Default"}</p>
              <ol className="space-y-1.5">
                {group.lines.map((line) => {
                  const completed = completedIds.includes(line.id);
                  const isActive = active === line.id;
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
                      <CircleCheck
                        className={cn("h-4 w-4 shrink-0", {
                          "stroke-[1px]": !isActive,
                          "fill-green-300 text-green-700 stroke-[2px]":
                            completed,
                        })}
                      />
                      <p
                        className={cn("group-hover:underline font-light", {
                          "font-bold": isActive,
                        })}
                      >
                        {line.sentence}
                      </p>
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
