import { IngredientItem } from "@/features/recipe/components/edit/ingredients/list/dnd_ingredient_list/IngredientItem";
import { RecipeIngredientFieldsFragment } from "@/gql/graphql";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
      {...attributes}
      {...listeners}
      className={`p-4 bg-gray-100 rounded-lg min-h-[400px]
              ${isDragging ? "opacity-50 border-2 border-blue-500" : ""}`}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <h2 className="mb-4 text-lg font-semibold">Container {id}</h2>
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item) => (
          <IngredientItem key={item.id} id={item.id} ingredient={item} />
        ))}
      </SortableContext>
    </div>
  );
}
