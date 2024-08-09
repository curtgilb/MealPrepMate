import {
  EditRecipeProps,
  EditRecipeSubmit,
} from "@/app/recipes/[id]/edit/page";
import { forwardRef, useImperativeHandle } from "react";
import {
  getRecipeIngredients,
  RecipeIngredientFragment,
} from "@/graphql/recipe/queries";
import { useQuery } from "@urql/next";
import { useFragment } from "@/gql";
import { Input } from "@/components/ui/input";
import { UnitPicker } from "@/components/pickers/UnitPicker";
import { IngredientPicker } from "@/components/pickers/IngredientPicker";
import { EditRecipeIngredientItem } from "./EditRecipeIngredientItem";

export const EditRecipeIngredients = forwardRef<
  EditRecipeSubmit,
  EditRecipeProps
>(function EditIngredients(props, ref) {
  const [result] = useQuery({
    query: getRecipeIngredients,
    variables: { id: props.recipeId },
  });

  const { data, error, fetching } = result;
  const ingredients = useFragment(
    RecipeIngredientFragment,
    data?.recipe.ingredients
  );
  useImperativeHandle(ref, () => ({
    submit(postSubmit) {
      console.log("child method");
      postSubmit();
    },
  }));

  return (
    <div>
      <p>Edit Recipe Ingredients</p>
      <ol className="flex flex-col gap-8">
        {ingredients?.map((ingredient) => {
          console.log(ingredient?.unit?.id);
          return (
            <EditRecipeIngredientItem
              key={ingredient.id}
              ingredient={ingredient}
            />
          );
        })}
      </ol>
    </div>
  );
});
