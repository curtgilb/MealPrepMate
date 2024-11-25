"use client";
import { useRouter } from "next/navigation";
import {
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
  useRef,
  useState,
} from "react";

import { Button } from "@/components/ui/button";
import { EditRecipeInfo } from "@/features/recipe/components/edit/info/EditRecipeInfo";
import { EditRecipeIngredients } from "@/features/recipe/components/edit/ingredients/EditRecipeIngredients";
import { EditRecipeNutritionLabels } from "@/features/recipe/components/edit/labels/EditRecipeNutritionLabels";
import { RecipeFieldsFragment } from "@/gql/graphql";

export interface EditRecipeProps {
  recipe: RecipeFieldsFragment | undefined | null;
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
  1: { Component: EditRecipeInfo, name: "basic info" },
  2: { Component: EditRecipeIngredients, name: "ingredients" },
  // 3: { Component: EditRecipeNutritionLabels, name: "nutrition label" },
};

export function RecipeEditor({ recipe }: EditRecipeProps) {
  const router = useRouter();
  const [editStage, setEditStage] = useState<number>(1);
  const { Component, name } = editComponents[editStage];
  const child = useRef<EditRecipeSubmit>(null);
  const isLastStep = editStage === Object.keys(editComponents).length;
  // const [result, executeQuery] = useQuery({
  //   query: getRecipeQuery,
  //   variables: { id: recipe?.id ?? "" },
  //   pause: true,
  // });

  function advanceStep() {
    if (child.current?.submit) {
      child.current.submit(() => {
        if (editStage < Object.keys(editComponents).length) {
          setEditStage(editStage + 1);
        } else if (isLastStep) {
          // Redirect to recipe page
          router.push(`/recipes/${recipe?.id}`);
        }
      });
    }
  }

  return (
    <>
      {/* Header */}
      <h1 className="text-3xl font-serif font-bold mb-6">{`${editStage}. ${
        recipe ? "Edit" : "Create"
      } recipe ${name}`}</h1>
      {/* Dynamic Content */}
      <Component ref={child} recipe={recipe}></Component>
      {/* Bottom */}
      <div className="flex justify-end gap-4 mt-6">
        <Button
          variant="outline"
          onClick={() => {
            if (editStage === 1) {
              router.back();
            } else {
              setEditStage(editStage - 1);
            }
          }}
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
    </>
  );
}
