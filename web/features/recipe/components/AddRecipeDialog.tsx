"use client";
import { FragmentType, getFragmentData } from "@/gql";
import { recipeSearchFragment } from "@/graphql/recipe/queries";
import { useState } from "react";
import { Card } from "../generics/Card";
import { ModalDrawer } from "../ModalDrawer";
import { NumberInput } from "../ui/number-input";
import { RecipeSearchFieldsFragment } from "@/gql/graphql";
import AnimatedNumbers from "react-animated-numbers";
import { Button } from "../ui/button";
import { AddRecipeDialog } from "../mealplan/AddRecipeDialog";
import { RecipeCard } from "./RecipeCard";

interface RecipeCardProps {
  recipe: FragmentType<typeof recipeSearchFragment>;
}

type AggregateLabelFields = RecipeSearchFieldsFragment["aggregateLabel"];

export function AddRecipeToMealPlan({ recipe: input }: RecipeCardProps) {
  const recipe = getFragmentData(recipeSearchFragment, input);
  const [open, setOpen] = useState<boolean>(false);

  const photoUrls = recipe.photos.map((photo) => {});

  return (
    <ModalDrawer
      title={recipe.name}
      content={<AddRecipeDialog recipe={recipe} />}
      open={open}
      setOpen={setOpen}
      trigger={<RecipeCard recipe={recipe} vertical={false} />}
    />
  );
}
