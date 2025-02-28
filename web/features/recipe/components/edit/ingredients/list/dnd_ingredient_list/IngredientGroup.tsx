import { Button } from "@/components/ui/button";
import { IngredientItem } from "@/features/recipe/components/edit/ingredients/list/dnd_ingredient_list/IngredientItem";
import {
  DEFAULT_KEY,
  useRecipeIngredientContext,
} from "@/features/recipe/hooks/useGroupedRecipeIngredients";
import { RecipeIngredientFieldsFragment } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

import { deleteRecipeIngredientGroupMutation } from "@/features/recipe/api/RecipeIngredientGroups";
import { useMutation } from "@urql/next";
import { Trash } from "lucide-react";

interface IngredientGroupProps {
  id: string;
  name: string;
  items: RecipeIngredientFieldsFragment[];
}

export function IngredientGroup({ id, items, name }: IngredientGroupProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      type: "container",
    },
  });

  const [{ fetching }, deleteGroup] = useMutation(
    deleteRecipeIngredientGroupMutation
  );
  const { removeGroup } = useRecipeIngredientContext();

  async function handleDelete() {
    await deleteGroup({ groupId: id }).then((result) => {
      if (!result.error) {
        removeGroup(id);
      }
    });
  }

  return (
    <div
      ref={setNodeRef}
      className={`p-4 bg-gray-100 rounded-lg min-h-64 overflow-hidden
              ${
                isDragging ? "opacity-50 ring ring-primary cursor-grabbing" : ""
              }`}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <GripVertical
          {...attributes}
          {...listeners}
          className={cn("h-4 w-4 cursor-grab")}
        />
        <h2 className=" text-lg font-semibold">{name}</h2>
        <div>
          {id !== DEFAULT_KEY && (
            <Button
              variant="ghost"
              size="sm"
              disabled={fetching}
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await handleDelete();
              }}
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item) => (
          <IngredientItem key={item.id} ingredient={item} />
        ))}
        {items.length === 0 && (
          <p className="italic text-sm font-light text-center mt-8">
            No ingredients have been added to this group
          </p>
        )}
      </SortableContext>
    </div>
  );
}
