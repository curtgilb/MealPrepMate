"use client";
import { Button } from "@/components/ui/button";
import { getRecipeQuery } from "@/features/recipe/api/Recipe";
import { EditRecipeInfo } from "@/features/recipe/components/edit/info/EditRecipeInfo";
import { EditIngredientGroups } from "@/features/recipe/components/edit/ingredient_groups/EditIngredientGroups";
import { EditRecipeIngredients } from "@/features/recipe/components/edit/ingredients/EditRecipeIngredients";
import { EditRecipeNutritionLabels } from "@/features/recipe/components/edit/labels/EditRecipeNutritionLabels";
import { RecipeFieldsFragment } from "@/gql/graphql";

import { useRouter } from "next/navigation";
import {
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
  useRef,
  useState,
} from "react";
import { useQuery } from "urql";

interface RecipeEditorProps {
  recipe: RecipeFieldsFragment | undefined;
}

export interface EditRecipeProps {
  recipe: RecipeFieldsFragment | undefined;
}

export interface EditRecipeSubmit {
  submit: (postSubmit: () => void) => void;
}

const editComponents: {
  [key: number]: {
    Component: ForwardRefExoticComponent<
      PropsWithoutRef<EditRecipeProps> & RefAttributes<EditRecipeSubmit>
    >;
    name: string;
  };
} = {
  1: { Component: EditRecipeInfo, name: "Basic info" },
  2: { Component: EditIngredientGroups, name: "Ingredient groups" },
  3: { Component: EditRecipeIngredients, name: "Match Ingredients" },
  4: { Component: EditRecipeNutritionLabels, name: "Nutrition Labels" },
};

export function RecipeEditor({ recipe }: RecipeEditorProps) {
  const router = useRouter();
  const [editStage, setEditStage] = useState<number>(1);
  const { Component, name } = editComponents[editStage];
  const child = useRef<EditRecipeSubmit>(null);
  const isLastStep = editStage === Object.keys(editComponents).length;
  const [result, executeQuery] = useQuery({
    query: getRecipeQuery,
    variables: { id: recipe?.id ?? "" },
    pause: true,
  });

  function advanceStep() {
    if (child.current?.submit) {
      child.current.submit(() => {
        if (editStage < Object.keys(editComponents).length) {
          setEditStage(editStage + 1);
          executeQuery();
        } else if (isLastStep) {
          // Redirect to recipe page
          router.push(`/recipes/${recipe?.id}`);
        }
      });
    }
  }

  return (
    <div>
      <p className="text-2xl font-bold mb-8">{`${editStage}. ${name}`}</p>
      <Component ref={child} recipe={recipe}></Component>
      <div className="flex justify-end gap-4 mt-6">
        <Button
          variant="outline"
          onClick={() => {
            setEditStage(editStage - 1);
          }}
          disabled={editStage === 0}
        >
          Back
        </Button>
        <Button
          onClick={() => {
            advanceStep();
          }}
        >
          {isLastStep ? "Finish" : "Save and continue"}
        </Button>
      </div>
    </div>
  );
}
