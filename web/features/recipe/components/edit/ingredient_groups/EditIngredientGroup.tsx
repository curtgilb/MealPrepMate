import { Button } from "@/components/ui/button";
import {
  deleteRecipeIngredientGroupMutation,
  editRecipeIngredientGroupMutation,
} from "@/features/recipe/api/RecipeIngredientGroups";
import { EditIngredientGroupItem } from "@/features/recipe/components/edit/ingredient_groups/EditIngredientGroupItem";
import { DEFAULT_KEY } from "@/features/recipe/components/edit/ingredient_groups/EditIngredientGroups";
import {
  EditIngredientGroupMutation,
  RecipeIngredientFieldsFragment,
} from "@/gql/graphql";
import { useDroppable } from "@dnd-kit/core";
import {
  rectSortingStrategy,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { result } from "lodash";
import { Trash2 } from "lucide-react";
import { useMutation } from "urql";

interface IngredientGroupProps {
  groupId: string;
  groupName: string | undefined | null;
  ingredients: RecipeIngredientFieldsFragment[];
  index: number;
  onItemEdit: (ingredient: RecipeIngredientFieldsFragment) => void;
  onItemDelete: (groupId: string, id: string) => void;
  onGroupEdit: (
    result: EditIngredientGroupMutation["editRecipeIngredientGroup"]
  ) => void;
  onGroupDelete: (groupId: string) => void;
}

export function EditIngredientGroup({
  groupId,
  groupName,
  ingredients,
  index,
  onItemEdit,
  onItemDelete,
  onGroupEdit,
  onGroupDelete,
}: IngredientGroupProps) {
  const { setNodeRef } = useDroppable({ id: groupId });
  const [editResult, editGroup] = useMutation(
    editRecipeIngredientGroupMutation
  );
  const [deleteResult, deleteGroup] = useMutation(
    deleteRecipeIngredientGroupMutation
  );

  function handleDelete() {
    deleteGroup({ groupId }).then((result) => {
      onGroupDelete(groupId);
    });
  }

  console.log(groupId);
  return (
    <div className="bg-muted">
      <div className="flex justify-between items-center">
        <p className="font-semibold mb-4">{groupName}</p>
        {groupId !== DEFAULT_KEY && (
          <Button size="icon" variant="outline" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <ol ref={setNodeRef} className="bg-muted grid gap-2 min-h-96  bg-white">
        <SortableContext
          id={groupId}
          items={ingredients}
          strategy={verticalListSortingStrategy}
        >
          {ingredients.map((ingredient) => (
            <EditIngredientGroupItem
              key={ingredient.id}
              id={ingredient.id}
              groupId={groupId}
              onEdit={onItemEdit}
              onDelete={onItemDelete}
              sentence={ingredient.sentence}
            />
          ))}
        </SortableContext>
      </ol>
    </div>
  );
}
