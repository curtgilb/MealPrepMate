import { VerificationProgress } from "@/components/VerificationProgress";
import { AddIngredient } from "@/features/recipe/components/edit/ingredients/list/AddIngredient";
import { CreateIngredientGroup } from "@/features/recipe/components/edit/ingredients/list/CreateIngredientGroup";
import { IngredientAndGroupList } from "@/features/recipe/components/edit/ingredients/list/dnd_ingredient_list/IngredientAndGroupList";
import { useRecipeIngredientContext } from "@/features/recipe/hooks/useGroupedRecipeIngredients";
import { group } from "console";
import { useMemo } from "react";

interface IngredientListProps {
  recipeId: string;
}

export function IngredientList({ recipeId }: IngredientListProps) {
  const { groupedIngredients } = useRecipeIngredientContext();

  const [stepsCompleted, steps] = useMemo(() => {
    return Object.values(groupedIngredients)
      .flat()
      .reduce(
        (totals, ingredient) => {
          if (ingredient.verified) {
            totals[0] = totals[0] + 1;
          }
          totals[1] = totals[1] + 1;

          return totals;
        },
        [0, 0]
      );
  }, [groupedIngredients]);

  return (
    <div className="max-w-96 space-y-4">
      <div className="flex justify-between">
        <h2 className="font-serif text-lg font-bold">Ingredient List</h2>

        <div className="flex gap-3">
          <AddIngredient recipeId={recipeId} />
          <CreateIngredientGroup recipeId={recipeId} />
        </div>
      </div>
      <VerificationProgress
        totalSteps={steps}
        stepsCompleted={stepsCompleted}
      />

      <IngredientAndGroupList />
    </div>
  );
}
