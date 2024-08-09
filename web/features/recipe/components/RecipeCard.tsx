import { recipeSearchFragment } from "@/graphql/recipe/queries";

import { FragmentType, useFragment } from "@/gql";
import { RecipeSearchFieldsFragment } from "@/gql/graphql";
import Link from "next/link";
import { Card } from "@/components/generics/Card";

interface RecipeCardProps {
  recipe: RecipeSearchFieldsFragment;
  vertical: boolean;
  children?: React.ReactNode;
}

export function RecipeCard({ recipe, vertical, children }: RecipeCardProps) {
  return (
    <Card
      className="shadow"
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
        <>
          <p className="text-sm line-clamp-1 font-semibold">{recipe.name}</p>
          <p className="text-sm"></p>
        </>
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
