import { useRecipeIngredientContext } from "@/features/recipe/hooks/useGroupedRecipeIngredients";
import { RecipeIngredientFieldsFragment } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CircleCheck, GripVertical } from "lucide-react";

interface IngredientItemProps {
  ingredient: RecipeIngredientFieldsFragment;
}

export function IngredientItem({ ingredient }: IngredientItemProps) {
  const { selected, setSelected } = useRecipeIngredientContext();

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

  const isSelected = selected === ingredient.id;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "group flex gap-2 py-1.5 px-4 mb-3 items-center justify-between bg-white rounded text-sm cursor-pointer",
        { "opacity-50": isDragging, "ring ring-primary": isSelected }
      )}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      onClick={() => {
        setSelected(ingredient.id);
      }}
    >
      <CircleCheck
        className={cn("w-6 h-6 shrink-0 stroke-muted-foreground self-center", {
          "fill-green-700 stroke-white": ingredient.verified,
        })}
      />

      <p
        className={cn("justify-self-start grow", { "font-medium": isSelected })}
      >
        {ingredient.sentence}
      </p>
      <GripVertical
        {...attributes}
        {...listeners}
        className={cn("h-4 w-4 grab shrink-0 cursor-grab", {
          "cursor-grabbing": isDragging,
        })}
      />
    </div>
  );
}
