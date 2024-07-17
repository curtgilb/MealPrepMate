import { graphql } from "@/gql";
import { FragmentType, useFragment } from "@/gql/fragment-masking";
import { RecipeIngredientFragmentFragment } from "@/gql/graphql";
import { RecipeIngredientFragment } from "@/graphql/recipe/queries";

type GroupedIngredient = {
  [key: string]: { id: string; lines: RecipeIngredientFragmentFragment[] };
};

export default function RecipeIngredients(props: {
  ingredients: FragmentType<typeof RecipeIngredientFragment>[];
}) {
  const ingredients = useFragment(RecipeIngredientFragment, props.ingredients);
  const groupedIngredients = ingredients.reduce((agg, line) => {
    const id = line.group?.id ?? "";
    const group = line.group?.name ?? "";
    if (!(group in agg)) {
      agg[group] = { id, lines: [] };
    }
    agg[group].lines.push(line);

    return agg;
  }, {} as GroupedIngredient);

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-xl font-bold">Ingredients</h2>
      {Object.entries(groupedIngredients).map(([groupName, group]) => {
        return (
          <div key={group.id}>
            <h3 className="font-semibold">{groupName}</h3>
            {group.lines.map((line) => {
              return <p key={line.id}>{line.sentence}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
}
