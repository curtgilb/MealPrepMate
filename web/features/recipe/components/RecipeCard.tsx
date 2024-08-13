import { Card } from "@/components/generics/Card";
import { MacroCardDisplay } from "@/features/recipe/components/recipe_search/MacroCardDisplay";
import { RecipeSearchFieldsFragment } from "@/gql/graphql";
import Link from "next/link";

interface RecipeCardProps {
  recipe: RecipeSearchFieldsFragment;
  vertical: boolean;
  children?: React.ReactNode;
}

export function RecipeCard({ recipe, vertical, children }: RecipeCardProps) {
  return (
    <Card
      className="shadow group focus:outline"
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
      vertical={vertical}
    >
      {children ? (
        children
      ) : (
        <div className="flex flex-col justify-between">
          <div>
            <p className="group-hover:underline font-semibold">{recipe.name}</p>
            <p className="text-sm min-h-16 ">
              {recipe.aggregateLabel?.servings} servings
            </p>
          </div>

          <MacroCardDisplay label={recipe.aggregateLabel} />
        </div>
      )}
    </Card>
  );
}

export function ClickableRecipeCard({
  recipe,
}: {
  recipe: RecipeSearchFieldsFragment;
}) {
  return (
    <Link href={`/recipes/${recipe.id}`}>
      <RecipeCard recipe={recipe} vertical={true} />
    </Link>
  );
}
