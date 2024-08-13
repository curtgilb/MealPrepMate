"use client";
import { forwardRef, useImperativeHandle, useState } from "react";

import { useQuery } from "@urql/next";
import { useFragment } from "@/gql";
import { Input } from "@/components/ui/input";
import { UnitPicker } from "@/components/pickers/UnitPicker";
import { IngredientPicker } from "@/components/pickers/IngredientPicker";
import { EditRecipeIngredientItem } from "./EditRecipeIngredientItem";
import {
  getRecipeIngredients,
  RecipeIngredientFragment,
} from "@/features/recipe/api/RecipeIngredient";
import {
  EditRecipeProps,
  EditRecipeSubmit,
} from "@/features/recipe/components/edit/RecipeEditor";
import { Progress } from "@/components/ui/progress";

export const EditRecipeIngredients = forwardRef<
  EditRecipeSubmit,
  EditRecipeProps
>(function EditIngredients(props, ref) {
  const [step, setStep] = useState<number>(0);
  const ingredients = useFragment(
    RecipeIngredientFragment,
    props.recipe?.ingredients
  );
  useImperativeHandle(ref, () => ({
    submit(postSubmit) {
      console.log("child method");
      postSubmit();
    },
  }));

  return (
    <div>
      <Progress value={step / (ingredients?.length ?? step)} />
      <ol className="flex flex-col gap-6">
        {ingredients?.map((ingredient) => {
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
