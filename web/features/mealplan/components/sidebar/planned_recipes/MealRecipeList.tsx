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
        return (
          <Card
            vertical={false}
            images={recipe.originalRecipe.photos.map((photo) => {
              return {
                id: photo.id,
                url: `${process.env.NEXT_PUBLIC_STORAGE_URL}${photo.url}`,
                altText: `Image of ${recipe.originalRecipe.name}`,
              };
            })}
            placeholderUrl="/placeholder_recipe.jpg"
            imageGrid={false}
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
