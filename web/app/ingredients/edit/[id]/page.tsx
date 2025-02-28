import SingleColumnCentered from "@/components/layouts/single-column-centered";
import {
  getIngredientQuery,
  ingredientFieldsFragment,
} from "@/features/ingredient/api/Ingredient";
import { EditIngredient } from "@/features/ingredient/components/edit/EditIngredient";
import { getFragmentData } from "@/gql";
import { getClient } from "@/ssrGraphqlClient";

export default async function EditIngredientPage({
  params,
}: {
  params: { id: string };
}) {
  const result = await getClient().query(getIngredientQuery, { id: params.id });
  const { data, error } = result;
  const ingredient = getFragmentData(
    ingredientFieldsFragment,
    data?.ingredient
  );

  return (
    <SingleColumnCentered>
      <EditIngredient ingredient={ingredient} />
    </SingleColumnCentered>
  );
}
