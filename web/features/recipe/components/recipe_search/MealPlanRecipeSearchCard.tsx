import { ReactNode } from "react";

import { Card } from "@/components/Card";
import { RecipeSearchFieldsFragment } from "@/gql/graphql";

interface MealPlanRecipeSearchCardProps {
  recipe: RecipeSearchFieldsFragment;
  onClick: (id: string) => void;
  children?: ReactNode;
}

export function MealPlanRecipeSearchCard({
  recipe,
  onClick,
  children,
}: MealPlanRecipeSearchCardProps) {
  const primaryPhoto =
    recipe.photos?.find((photo) => photo.isPrimary) ?? recipe.photos?.[0];

  return (
    <Card
      orientation="horizontal"
      image={
        primaryPhoto
          ? { id: primaryPhoto.id, url: primaryPhoto.url, altText: recipe.name }
          : undefined
      }
      placeholderUrl="/placeholder_recipe.jpg"
      imageAspectRatio="sqaure"
      size="sm"
      onClick={() => onClick(recipe.id)}
    >
      <div className="flex justify-between">
        {children ? (
          children
        ) : (
          <div>
            <p className="text-sm line-clamp-1">{recipe.name}</p>
            <p className="text-xs ">
              {recipe.aggregateLabel?.servings} servings
            </p>
          </div>
        )}

        {/* <MacroCardDisplay label={recipe.aggregateLabel} /> */}
      </div>
    </Card>
  );
}
