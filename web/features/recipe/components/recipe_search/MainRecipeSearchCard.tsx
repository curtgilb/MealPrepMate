import { Card } from "@/components/Card";
import { RecipeSearchFieldsFragment, SearchRecipesQuery } from "@/gql/graphql";

interface MainRecipeSearchCardProps {
  recipe: RecipeSearchFieldsFragment;
}

export function MainRecipeSearchCard({ recipe }: MainRecipeSearchCardProps) {
  return (
    <Card
      href={`/recipes/${recipe.id}`}
      vertical={true}
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
