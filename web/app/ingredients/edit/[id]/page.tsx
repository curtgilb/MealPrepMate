import SingleColumnCentered from "@/components/layouts/single-column-centered";
import { ingredientQuery } from "@/features/ingredient/api/queries/getIngredientQuery";
import { EditIngredient } from "@/features/ingredient/components/EditIngredient";
import { getClient } from "@/ssrGraphqlClient";

export default async function EditIngredientPage({
  params,
}: {
  params: { id: string };
}) {
  const result = await getClient().query(ingredientQuery, { id: params.id });
  const { data, error } = result;

  return (
    <SingleColumnCentered>
      <EditIngredient ingredient={data?.ingredient} />
    </SingleColumnCentered>
  );
}
