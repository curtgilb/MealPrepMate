"use client";
import { FragmentType, useFragment } from "@/gql";
import { recipeSearchFragment } from "@/graphql/recipe/getRecipe";
import { useState } from "react";
import { Card } from "../generics/Card";
import { ModalDrawer } from "../ModalDrawer";
import { NumberInput } from "../ui/number-input";
import { RecipeSearchFieldsFragment } from "@/gql/graphql";
import AnimatedNumbers from "react-animated-numbers";
import { Button } from "../ui/button";
import { AddRecipeDialog } from "../mealplan/AddRecipeDialog";

interface RecipeCardProps {
  recipe: FragmentType<typeof recipeSearchFragment>;
}

type AggregateLabelFields = RecipeSearchFieldsFragment["aggregateLabel"];

export default function RecipeCard({ recipe: input }: RecipeCardProps) {
  const recipe = useFragment(recipeSearchFragment, input);
  const [open, setOpen] = useState<boolean>(false);

  const photoUrls = recipe.photos.map((photo) => {});

  return (
    <ModalDrawer
      title={recipe.name}
      content={<AddRecipeDialog recipe={recipe} />}
      open={open}
      setOpen={setOpen}
      trigger={
        <Card
          image={{
            images: recipe.photos
              .filter((photo) => photo.isPrimary)
              .map((photo) => ({
                url: photo.url,
                altText: recipe.name,
              })),
            grid: false,
            placeholder: "/pot.jpg",
          }}
          vertical={false}
        >
          <p className="text-sm line-clamp-1 font-semibold">{recipe.name}</p>
          <p className="text-sm"></p>
        </Card>
      }
    />
  );
}
