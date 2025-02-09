import { Card } from "@/components/Card";
import { MealPlanRecipeFieldsFragment } from "@/gql/graphql";

interface MealPlanRecipeListProps {
  recipes: MealPlanRecipeFieldsFragment[] | null | undefined;
  setRecipe: (recipe: MealPlanRecipeFieldsFragment) => void;
}

export function MealRecipeList({
  recipes,
  setRecipe,
}: MealPlanRecipeListProps) {
  return (
    <div className="grid gap-y-4">
      {recipes?.map((recipe) => {
        const primaryPhoto =
          recipe.originalRecipe.photos?.find((photo) => photo.isPrimary) ??
          recipe.originalRecipe.photos?.[0];
        return (
          <Card
            key={recipe.id}
            orientation="horizontal"
            image={
              primaryPhoto
                ? {
                    id: primaryPhoto.id,
                    url: primaryPhoto.url,
                    altText: recipe.originalRecipe.name,
                  }
                : undefined
            }
            placeholderUrl="/placeholder_recipe.jpg"
            size="xs"
            imageAspectRatio="sqaure"
            onClick={() => setRecipe(recipe)}
          >
            <div className="flex justify-between">
              <div>
                <p className="text-sm line-clamp-1">
                  {recipe.originalRecipe.name}
                </p>
                <p className="text-xs ">
                  {recipe.servingsOnPlan} / {recipe.totalServings} servings
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
