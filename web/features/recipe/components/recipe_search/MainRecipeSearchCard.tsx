import { Card } from "@/components/Card";
import { RecipeSearchFieldsFragment, SearchRecipesQuery } from "@/gql/graphql";

interface MainRecipeSearchCardProps {
  recipe: RecipeSearchFieldsFragment;
}

export function MainRecipeSearchCard({ recipe }: MainRecipeSearchCardProps) {
  const primaryPhoto = recipe.photos.length > 0 ? recipe.photos[0] : undefined;

  return (
    <Card
      href={`/recipes/${recipe.id}`}
      orientation="vertical"
      image={
        primaryPhoto && {
          id: primaryPhoto.id,
          url: primaryPhoto.url,
          altText: recipe.name,
        }
      }
      placeholderUrl="/placeholder_recipe.jpg"
      size="md"
    >
      <div className="flex flex-col justify-between">
        <div>
          <p className="group-hover:underline">{recipe.name}</p>
          <p className="text-sm min-h-16 ">
            {recipe.aggregateLabel?.servings} servings
          </p>
        </div>

        {/* <MacroCardDisplay label={recipe.aggregateLabel} /> */}
      </div>
    </Card>
  );
}
