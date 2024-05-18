import { FragmentType, graphql, useFragment } from "@/gql";
import Image from "next/image";
import { Card } from "../generics/Card";
import { recipeSearchFragment } from "@/graphql/recipe/getRecipe";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { ModalDrawer } from "../ModalDrawer";

interface RecipeCardProps {
  recipe: FragmentType<typeof recipeSearchFragment>;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const tRecipe = useFragment(recipeSearchFragment, recipe);
  const photoUrls = tRecipe.photos.map((photo) => {});

  return (
    <ModalDrawer
      title="Add to meal plan"
      content={<p>asdf</p>}
      trigger={
        <Card
          urls={[]}
          altText={`Photo of ${tRecipe.name} recipe`}
          vertical={false}
        >
          <p className="text-sm line-clamp-1 font-semibold">{tRecipe.name}</p>
          <p className="text-sm">
            {tRecipe.aggregateLabel?.servings} servings
            {tRecipe.aggregateLabel?.caloriesPerServing
              ? `(${Math.round(
                  tRecipe.aggregateLabel?.caloriesPerServing
                )} calories)`
              : null}
          </p>
        </Card>
      }
    />
  );
}
