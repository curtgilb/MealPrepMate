import { RecipeIngredientFieldsFragment } from "@/gql/graphql";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableItemProps {
  id: string;
  ingredient: RecipeIngredientFieldsFragment;
}

export function IngredientItem({ id, ingredient }: SortableItemProps) {
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
      type: "item",
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`p-4 mb-2 bg-white rounded shadow cursor-grab 
              ${isDragging ? "opacity-50" : ""}`}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      {ingredient.sentence}
    </div>
  );
}
