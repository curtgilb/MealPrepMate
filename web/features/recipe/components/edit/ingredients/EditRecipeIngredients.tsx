"use client";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useFragment } from "@/gql";
import { Progress } from "@/components/ui/progress";
import { RecipeIngredientFragment } from "@/features/recipe/api/RecipeIngredient";
import { EditRecipeIngredientItem } from "@/features/recipe/components/edit/ingredients/EditRecipeIngredientItem";
import { IngredientList } from "@/features/recipe/components/edit/ingredients/IngredientList";
import {
  EditRecipeProps,
  EditRecipeSubmit,
} from "@/features/recipe/components/edit/RecipeEditor";

export const EditRecipeIngredients = forwardRef<
  EditRecipeSubmit,
  EditRecipeProps
>(function EditIngredients(props, ref) {
  const [step, setStep] = useState<number>(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const ingredients = useFragment(
    RecipeIngredientFragment,
    props.recipe?.ingredients
  );
  useImperativeHandle(ref, () => ({
    submit(postSubmit) {
      postSubmit();
    },
  }));
  const ingredient = ingredients?.[step];
  const percent = ingredients
    ? (completed.length / ingredients.length) * 100
    : 0;
  return (
    <div className="border rounded-md bg-white flex gap-16 px-6 py-4">
      <div>
        <p className="text-lg font-semibold">Ingredients List</p>
        <div className="my-6">
          <Progress className="h-2.5" value={percent} />
          <p className="text-xs font-light text-right">
            Verified {completed.length} of {ingredients?.length ?? 0}
          </p>
        </div>
        <IngredientList
          ingredients={ingredients}
          completedIds={completed}
          active={ingredient?.id}
          jumpTo={(index) => {
            setStep(index);
          }}
        />
      </div>

      {ingredient && (
        <div>
          <EditRecipeIngredientItem
            ingredient={ingredient}
            advance={() => {
              if (!completed.includes(ingredient.id)) {
                setCompleted([...completed, ingredient.id]);
                setStep(step + 1);
              }
            }}
            back={() => {
              if (step > 0) {
                setStep(step - 1);
              }
            }}
          />
        </div>
      )}
    </div>
  );
});
