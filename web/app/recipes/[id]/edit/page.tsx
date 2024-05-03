import { RecipeEditor } from "@/components/recipe/edit/RecipeEditor";
import { getRecipe } from "@/graphql/recipe/getRecipe.graphql";

export default function EditRecipe({ params }: { params: { id: string } }) {
  return <RecipeEditor id={params.id} />;
}
