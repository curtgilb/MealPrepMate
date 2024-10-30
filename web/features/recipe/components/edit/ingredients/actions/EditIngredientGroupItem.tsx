import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  deleteRecipeIngredientMutation,
  editRecipeIngredientMutation,
} from "@/features/recipe/api/RecipeIngredient";
import { RecipeIngredientFieldsFragment } from "@/gql/graphql";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation } from "@urql/next";
import { Check, GripVertical, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

interface EditIngredientGroupItemProps {
  groupId: string;
  id: string;
  sentence: string;
  onEdit: (ingredient: RecipeIngredientFieldsFragment) => void;
  onDelete: (groupId: string, id: string) => void;
}

// Edit the text and remove it

export function EditIngredientGroupItem({
  sentence,
  id,
  groupId,
  onEdit,
  onDelete,
}: EditIngredientGroupItemProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [edit, setEdit] = useState<boolean>(false);
  const [editResult, editIngredient] = useMutation(
    editRecipeIngredientMutation
  );
  const [deleteResult, deleteIngredient] = useMutation(
    deleteRecipeIngredientMutation
  );
  const { fetching: editFetching } = editResult;
  const { fetching: deleteFetching } = deleteResult;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  function handleEdit() {
    editIngredient({
      ingredients: [{ id, sentence: inputRef.current?.value }],
    }).then((result) => {
      if (result?.data?.editRecipeIngredients) {
        onEdit(
          result.data.editRecipeIngredients[0] as RecipeIngredientFieldsFragment
        );
      }
      setEdit(false);
    });
  }

  function handleDelete() {
    deleteIngredient({
      id: id,
    }).then(() => {
      onDelete(groupId, id);
      setEdit(false);
    });
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white px-4 items-center py-2 flex gap-3 border rounded-md"
    >
      <div>
        {edit ? (
          <div className="flex gap-2">
            <div>
              <Input
                ref={inputRef}
                defaultValue={id}
                className="grow w-full h-full"
                autoFocus
              />
            </div>
            <div className="flex shrink w-auto justify-center">
              <Button
                size="icon"
                variant="ghost"
                disabled={editFetching}
                onClick={handleEdit}
                className="hover:text-green-600"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                className="hover:text-red-500"
                size="icon"
                onClick={handleDelete}
                variant="ghost"
                disabled={deleteFetching}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <div {...listeners} style={{ cursor: "grab" }}>
              <GripVertical className="h-5 w-5 drag-handle" />
            </div>
            <p className="text-sm">{id}</p>
          </div>
        )}
      </div>
    </li>
  );
}
