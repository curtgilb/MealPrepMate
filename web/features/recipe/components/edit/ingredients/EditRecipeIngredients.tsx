"use client";
import { forwardRef, useImperativeHandle, useState } from "react";

import { useQuery } from "@urql/next";
import { useFragment } from "@/gql";
import { Input } from "@/components/ui/input";
import { UnitPicker } from "@/components/pickers/UnitPicker";
import { IngredientPicker } from "@/components/pickers/IngredientPicker";

import {
  getRecipeIngredients,
  RecipeIngredientFragment,
} from "@/features/recipe/api/RecipeIngredient";
import {
  EditRecipeProps,
  EditRecipeSubmit,
} from "@/features/recipe/components/edit/RecipeEditor";
import { Progress } from "@/components/ui/progress";
import { EditRecipeIngredientItem } from "@/features/recipe/components/edit/ingredients/EditRecipeIngredientItem";
import { set } from "lodash";
import { IngredientList } from "@/features/recipe/components/edit/ingredients/IngredientList";

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
  return (
    <div className="border rounded-md bg-white flex px-6 py-4">
      <div>
        <Progress value={step / (ingredients?.length ?? step)} />
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
        <EditRecipeIngredientItem
          ingredient={ingredient}
          advance={() => {
            if (step < ingredients?.length) {
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
      )}
    </div>
  );
});
