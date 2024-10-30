import { Button } from "@/components/ui/button";
import { deleteRecipeIngredientMutation } from "@/features/recipe/api/RecipeIngredient";
import { createRecipeIngredientGroupMutation } from "@/features/recipe/api/RecipeIngredientGroups";
import { CreateIngredientGroupMutation } from "@/gql/graphql";
import { useMutation } from "@urql/next";
import { Trash } from "lucide-react";

interface DeleteIngredientItemProps {
  groupId: string;
  recipeIngredientId: string;
  onDelete: (groupId: string, itemId: string) => void;
}

export function CreateIngredientGroup({
  groupId,
  recipeIngredientId,
  onDelete,
}: DeleteIngredientItemProps) {
  const [result, deleteIngredient] = useMutation(
    deleteRecipeIngredientMutation
  );

  return (
    <Button
      size="icon"
      onClick={() => {
        deleteIngredient({ id: recipeIngredientId }).then((result) => {
          if (result.data && result.data.deleteRecipeIngredientGroup.success) {
          }
        });
      }}
    >
      <Trash className="h-4 w-4" />
    </Button>
  );
}
