import { getIngredientQuery, ingredientFragment } from '@/features/ingredient/api/Ingredient';
import { IngredientEditor } from '@/features/ingredient/components/edit/IngredientEditor';
import { getFragmentData } from '@/gql';
import { getClient } from '@/ssrGraphqlClient';

export default async function EditRecipe({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const result = await getClient().query(getIngredientQuery, {
    id: decodeURIComponent(id),
  });
  const recipe = getFragmentData(recipeFragment, result.data?.recipe);

  return (
    <>
      <RecipeEditor recipe={recipe} />
    </>
  );
}
