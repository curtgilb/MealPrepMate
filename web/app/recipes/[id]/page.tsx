import { getRecipeQuery } from "@/features/recipe/api/Recipe";
import { RecipeView } from "@/features/recipe/components/view/Recipe";
import { getClient } from "@/ssrGraphqlClient";

export default async function Recipe({ params }: { params: { id: string } }) {
  const result = await getClient().query(getRecipeQuery, {
    id: params.id,
  });
  const { data, error } = result;

  if (!data) return <p>Something went wrong</p>;
  return <RecipeView recipe={data.recipe} />;
}
