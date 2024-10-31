import { DeleteIngredientGroup } from "@/features/recipe/components/edit/ingredients/list/dnd_ingredient_list/DeleteIngredientGroup";
import { IngredientItem } from "@/features/recipe/components/edit/ingredients/list/dnd_ingredient_list/IngredientItem";
import { RecipeIngredientFieldsFragment } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface IngredientGroupProps {
  id: string;
  items: RecipeIngredientFieldsFragment[];
}

export function IngredientGroup({ id, items }: IngredientGroupProps) {
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

  return (
    <div
      ref={setNodeRef}
      className={`p-4 bg-gray-100 rounded-lg min-h-[400px]
              ${
                isDragging ? "opacity-50 ring ring-primary cursor-grabbing" : ""
              }`}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div className="flex justify-between items-center">
        <GripVertical
          {...attributes}
          {...listeners}
          className={cn("h-4 w-4 cursor-grab")}
        />
        <h2 className="mb-4 text-lg font-semibold">{id}</h2>
        <DeleteIngredientGroup />
      </div>
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item, index) => (
          <IngredientItem
            key={item.id}
            group={id}
            index={index}
            ingredient={item}
          />
        ))}
      </SortableContext>
    </div>
  );
}
