import { graphql } from "@/gql";
import { FragmentType, useFragment } from "@/gql/fragment-masking";

export const RecipeIngredientFields = graphql(`
  fragment RecipeIngredientFields on RecipeIngredients {
    id
    name
    order
    quantity
    sentence
    unit {
      id
      name
      symbol
    }
    baseIngredient {
      id
      name
      alternateNames
    }
    group {
      id
      name
    }
  }
`);

export function EditRecipeIngredients(props: {
  ingredients?: FragmentType<typeof RecipeIngredientFields>[];
}) {
  const ingredients = useFragment(RecipeIngredientFields, props.ingredients);
  return (
    <div>
      <p>Ingredients</p>
      {ingredients?.map((ingredient) => {
        return (
          <div key={ingredient.id}>
            <p>{ingredient.sentence}</p>
          </div>
        );
      })}
    </div>
  );
}
