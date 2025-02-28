import { getRecipeQuery, recipeFragment } from "@/features/recipe/api/Recipe";
import { Recipe } from "@/features/recipe/components/view/Recipe";
import { getFragmentData } from "@/gql";
import { getClient } from "@/ssrGraphqlClient";

export default async function RecipePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const result = await getClient().query(getRecipeQuery, {
    id: decodeURIComponent(id),
  });
  const { data, error } = result;
  const recipe = getFragmentData(recipeFragment, data?.recipe);

  if (!data) return <p>Something went wrong</p>;
  return <Recipe recipe={recipe} />;
}
