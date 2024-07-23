import { EditIngredientGroupItem } from "@/components/recipe/edit/groups/EditIngredientGroupItem";
import { RecipeIngredientFragmentFragment } from "@/gql/graphql";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface IngredientGroupProps {
  groupId: string;
  groupName: string;
  ingredients: RecipeIngredientFragmentFragment[];
  index: number;
}

export function IngredientGroup({
  groupId,
  groupName,
  ingredients,
  index,
}: IngredientGroupProps) {
  return (
    <div className="bg-muted">
      <p className="font-semibold">{groupName ?? `Group ${index + 1}`}</p>
      <SortableContext
        id={groupId}
        items={ingredients}
        strategy={verticalListSortingStrategy}
      >
        <ol className="bg-muted p-4 grid gap-2">
          {ingredients.map((ingredient) => (
            <EditIngredientGroupItem
              key={ingredient.id}
              id={ingredient.id}
              sentence={ingredient.sentence}
            />
          ))}
        </ol>
      </SortableContext>
    </div>
  );
}
