import SingleColumnCentered from "@/components/layouts/single-column-centered";
import { getIngredientQuery } from "@/features/ingredient/api/Ingredient";
import { EditIngredient } from "@/features/ingredient/components/EditIngredient";
import { getClient } from "@/ssrGraphqlClient";

export default async function EditIngredientPage({
  params,
}: {
  params: { id: string };
}) {
  const result = await getClient().query(getIngredientQuery, { id: params.id });
  const { data, error } = result;

  return (
    <SingleColumnCentered>
      <EditIngredient ingredient={data?.ingredient} />
    </SingleColumnCentered>
  );
}
