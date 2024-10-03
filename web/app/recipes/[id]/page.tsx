import { getRecipeQuery, recipeFragment } from "@/features/recipe/api/Recipe";
import { Recipe } from "@/features/recipe/components/view/Recipe";
import { useFragment } from "@/gql";
import { getClient } from "@/ssrGraphqlClient";

export default async function RecipePage({
  params,
}: {
  params: { id: string };
}) {
  const result = await getClient().query(getRecipeQuery, {
    id: params.id,
  });
  const { data, error } = result;
  const recipe = useFragment(recipeFragment, data?.recipe);

  if (!data) return <p>Something went wrong</p>;
  return <Recipe recipe={recipe} />;
}
