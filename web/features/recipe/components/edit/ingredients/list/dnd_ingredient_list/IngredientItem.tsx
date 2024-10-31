import { useRecipeIngredientContext } from "@/features/recipe/hooks/useGroupedRecipeIngredients";
import { RecipeIngredientFieldsFragment } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CircleCheck, GripVertical } from "lucide-react";

interface SortableItemProps {
  group: string;
  index: number;
  ingredient: RecipeIngredientFieldsFragment;
}

export function IngredientItem({
  group,
  index,
  ingredient,
}: SortableItemProps) {
  const { groupedIngredients, activeIngredient, setActiveIngredient } =
    useRecipeIngredientContext();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: ingredient.id,
    data: {
      type: "item",
    },
  });
  const selected =
    groupedIngredients[activeIngredient.group][activeIngredient.index];
  const isSelected = selected.id === ingredient.id;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "group flex gap-2 py-1.5 px-4 mb-3 items-center justify-between bg-white rounded shadow text-sm cursor-pointer",
        { "opacity-50": isDragging, "ring ring-primary": isSelected }
      )}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      onClick={() => {
        setActiveIngredient({ group, index });
      }}
    >
      <GripVertical
        {...attributes}
        {...listeners}
        className={cn("h-4 w-4 grab shrink-0 cursor-grab", {
          "cursor-grabbing": isDragging,
        })}
      />

      <p
        className={cn("justify-self-start grow", { "font-medium": isSelected })}
      >
        {ingredient.sentence}
      </p>
      <CircleCheck
        className={cn("w-4 h-4 shrink-0 stroke-muted-foreground self-center", {
          "stroke-green-700": ingredient.verified,
        })}
      />
    </div>
  );
}
