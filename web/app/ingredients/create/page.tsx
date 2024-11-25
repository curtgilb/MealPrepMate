import SingleColumnCentered from "@/components/layouts/single-column-centered";
import { IngredientEditor } from "@/features/ingredient/components/edit/EditIngredient";

export default function CreateIngredientPage() {
  return (
    <SingleColumnCentered>
      <IngredientEditor />
    </SingleColumnCentered>
  );
}
