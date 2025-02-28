import { getRecipeQuery, recipeFragment } from "@/features/recipe/api/Recipe";
import { RecipeEditor } from "@/features/recipe/components/edit/RecipeEditor";
import { getFragmentData } from "@/gql";
import { getClient } from "@/ssrGraphqlClient";

export default async function EditRecipe({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const result = await getClient().query(getRecipeQuery, {
    id: decodeURIComponent(id),
  });
  const recipe = getFragmentData(recipeFragment, result.data?.recipe);

  return (
    <>
      <RecipeEditor recipe={recipe} />
    </>
  );
}
