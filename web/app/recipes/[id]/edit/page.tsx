import { getRecipeQuery } from "@/features/recipe/api/Recipe";
import { RecipeEditor } from "@/features/recipe/components/edit/RecipeEditor";
import { getClient } from "@/ssrGraphqlClient";

export default async function EditRecipe({
  params,
}: {
  params: { id: string };
}) {
  const result = await getClient().query(getRecipeQuery, { id: params.id });

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">
        Edit {result.data?.recipe.name}
      </h1>
      <RecipeEditor recipe={result.data?.recipe} />
    </>
  );
}
