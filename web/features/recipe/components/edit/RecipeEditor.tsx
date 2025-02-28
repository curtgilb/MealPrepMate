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
import { BasicRecipeInfoFields } from "@/features/recipe/components/edit/info/BasicRecipeInfoFields";
import { RecipeIngredientsEditor } from "@/features/recipe/components/edit/ingredients/RecipeIngredientsEditor";
import { NutritionLabelEditor } from "@/features/recipe/components/edit/labels/NutritionLabelEditor";
import { RecipeFieldsFragment } from "@/gql/graphql";
import { useQuery } from "@urql/next";
import { getRecipeQuery, recipeFragment } from "@/features/recipe/api/Recipe";
import { getFragmentData } from "@/gql";

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
  1: { Component: BasicRecipeInfoFields, name: "basic info" },
  2: { Component: RecipeIngredientsEditor, name: "ingredients" },
  3: { Component: NutritionLabelEditor, name: "nutrition label" },
};

export function RecipeEditor({ recipe }: EditRecipeProps) {
  const router = useRouter();
  const [editStage, setEditStage] = useState<number>(1);
  const { Component, name } = editComponents[editStage];
  const child = useRef<EditRecipeSubmit>(null);
  const isLastStep = editStage === Object.keys(editComponents).length;
  const [result] = useQuery({
    query: getRecipeQuery,
    // requestPolicy: "network-only",
    variables: { id: recipe?.id ?? "" },
  });

  function advanceStep() {
    if (child.current?.submit) {
      child.current.submit(async () => {
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
      <div className="flex justify-between mb-14 align-middle">
        <h1 className="text-3xl font-serif font-bold ">{`${editStage}. ${
          recipe ? "Edit" : "Create"
        } recipe ${name}`}</h1>

        <div className="flex justify-end gap-4 ">
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
      </div>

      {/* Dynamic Content */}
      <Component
        ref={child}
        recipe={getFragmentData(recipeFragment, result.data?.recipe)}
      ></Component>
    </>
  );
}
