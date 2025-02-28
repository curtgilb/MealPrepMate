import SingleColumnCentered from "@/components/layouts/single-column-centered";
import {
  getIngredientQuery,
  ingredientFieldsFragment,
} from "@/features/ingredient/api/Ingredient";
import { IngredientEditor } from "@/features/ingredient/components/edit/EditIngredient";
import { getFragmentData } from "@/gql";
import { getClient } from "@/ssrGraphqlClient";

export default async function EditIngredient({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const result = await getClient().query(getIngredientQuery, {
    id: decodeURIComponent(id),
  });
  const ingredient = getFragmentData(
    ingredientFieldsFragment,
    result.data?.ingredient
  );

  return (
    <SingleColumnCentered condensed>
      <IngredientEditor ingredient={ingredient} />
    </SingleColumnCentered>
  );
}
