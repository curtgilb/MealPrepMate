import { getRecipeQuery, recipeFragment } from "@/features/recipe/api/Recipe";
import { RecipeEditor } from "@/features/recipe/components/edit/RecipeEditor";
import { useFragment } from "@/gql";
import { getClient } from "@/ssrGraphqlClient";

export default async function EditRecipe({
  params,
}: {
  params: { id: string };
}) {
  const result = await getClient().query(getRecipeQuery, { id: params.id });
  const recipe = useFragment(recipeFragment, result.data?.recipe);

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Edit {recipe?.name}</h1>
      <RecipeEditor recipe={recipe} />
    </>
  );
}
