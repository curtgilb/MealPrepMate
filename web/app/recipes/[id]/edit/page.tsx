"use client";
import { EditIngredientGroups } from "@/components/recipe/edit/EditIngredientGroups";
import { EditRecipeInfo } from "@/components/recipe/edit/EditRecipeInfo";
import { EditRecipeIngredients } from "@/components/recipe/edit/EditRecipeIngredients";
import { EditRecipeNutritionLabels } from "@/components/recipe/edit/EditRecipeNutritionLabels";
import { Button } from "@/components/ui/button";
import { getRecipeQuery } from "@/graphql/recipe/queries";
import { useQuery } from "@urql/next";
import { useRouter } from "next/navigation";
import {
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
  useRef,
  useState,
} from "react";

export interface EditRecipeProps {
  recipeId: string;
}

export interface EditRecipeSubmit {
  submit: (postSubmit: () => void) => void;
}

const editComponents: {
  [key: number]: ForwardRefExoticComponent<
    PropsWithoutRef<EditRecipeProps> & RefAttributes<EditRecipeSubmit>
  >;
} = {
  1: EditRecipeInfo,
  2: EditIngredientGroups,
  3: EditRecipeIngredients,
  4: EditRecipeNutritionLabels,
};

export default function EditRecipe({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [editStage, setEditStage] = useState<number>(1);
  const [result] = useQuery({
    query: getRecipeQuery,
    variables: { id: params.id },
  });
  const EditStage = editComponents[editStage];
  const child = useRef<EditRecipeSubmit>(null);
  const isLastStep = editStage === Object.keys(editComponents).length;

  function advanceStep() {
    if (child.current?.submit) {
      child.current.submit(() => {
        if (editStage < Object.keys(editComponents).length) {
          setEditStage(editStage + 1);
        } else if (isLastStep) {
          // Redirect to recipe page
          router.push(`/recipes/${params.id}`);
        }
      });
    }
  }

  return (
    <div>
      <EditStage ref={child} recipeId={params.id}></EditStage>
      <div className="flex gap-4">
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
