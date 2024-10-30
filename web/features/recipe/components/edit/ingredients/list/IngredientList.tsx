import { AddIngredient } from "@/features/recipe/components/edit/ingredients/list/AddIngredient";
import { CreateIngredientGroup } from "@/features/recipe/components/edit/ingredients/list/CreateIngredientGroup";
import { IngredientAndGroupList } from "@/features/recipe/components/edit/ingredients/list/dnd_ingredient_list/IngredientAndGroupList";

interface IngredientListProps {
  recipeId: string;
}

export function IngredientList({ recipeId }: IngredientListProps) {
  return (
    <div className="max-w-96 space-y-4">
      <div className="flex gap-3">
        <AddIngredient recipeId={recipeId} />
        <CreateIngredientGroup recipeId={recipeId} />
      </div>
      <IngredientAndGroupList />
    </div>
  );
}
