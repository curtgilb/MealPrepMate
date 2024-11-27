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
  return (
    <Card
      vertical={false}
      images={recipe.photos.map((photo) => {
        return {
          id: photo.id,
          url: `${process.env.NEXT_PUBLIC_STORAGE_URL}${photo.url}`,
          altText: `Image of ${recipe.name}`,
        };
      })}
      placeholderUrl="/placeholder_recipe.jpg"
      imageGrid={false}
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
