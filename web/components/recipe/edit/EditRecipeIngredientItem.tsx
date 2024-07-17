import { UnitPicker } from "@/components/pickers/UnitPicker";
import { Input } from "@/components/ui/input";
import { RecipeIngredientFragmentFragment } from "@/gql/graphql";

interface EditRecipeIngredientItemProps {
  ingredient: RecipeIngredientFragmentFragment;
}

export function EditRecipeIngredientItem({
  ingredient,
}: EditRecipeIngredientItemProps) {
  return (
    <li className="p-4 rounded-md bg-white">
      <p className="text-lg font-medium mb-4">{ingredient.sentence}</p>
      <div className="flex gap-6">
        <Input type="number" defaultValue={ingredient.quantity ?? ""}></Input>
        <UnitPicker
          create
          placeholder={ingredient.unit ? ingredient.unit.name : "Unit"}
          multiselect={false}
          selectedIds={ingredient.unit?.id ? [ingredient.unit.id] : []}
          select={(unit) => {}}
          deselect={(unit) => {}}
        />
      </div>
    </li>
  );
}
