import { Card } from "@/components/Card";
import { RecipeSearchFieldsFragment } from "@/gql/graphql";

interface MealPlanRecipeSearchCardProps {
  recipe: RecipeSearchFieldsFragment;
}

export function MealPlanRecipeSearchCard({
  recipe,
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
    >
      <div className="flex justify-between">
        <div>
          <p className="text-sm line-clamp-1">{recipe.name}</p>
          <p className="text-xs ">{recipe.aggregateLabel?.servings} servings</p>
        </div>

        {/* <MacroCardDisplay label={recipe.aggregateLabel} /> */}
      </div>
    </Card>
  );
}
