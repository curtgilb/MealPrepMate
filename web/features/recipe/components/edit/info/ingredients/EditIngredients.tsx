import { ParseIngredients } from "@/features/recipe/components/edit/info/ingredients/ParseIngredients";
import { RecipeFieldsFragment } from "@/gql/graphql";

interface EditIngredientsProps {
  ingredients: RecipeFieldsFragment["ingredients"] | null | undefined;
}

export function EditIngredients({ ingredients }: EditIngredientsProps) {
  if (!ingredients) {
    return <ParseIngredients />;
  }
}
