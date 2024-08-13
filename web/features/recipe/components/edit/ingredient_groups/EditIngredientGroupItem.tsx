import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface EditIngredientGroupItemProps {
  id: string;
  sentence: string;
}

// Edit the text and remove it

export function EditIngredientGroupItem({
  sentence,
  id,
}: EditIngredientGroupItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white px-4 py-2"
    >
      {sentence}
    </li>
  );
}
