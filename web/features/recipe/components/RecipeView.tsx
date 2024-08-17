import SingleColumnCentered from "@/components/layouts/single-column-centered";
import { Button } from "@/components/ui/button";
import { RecipeNutritionlabel } from "@/features/recipe/components/nutrition_label/RecipeNutritionLabel";
import RecipeIngredients from "@/features/recipe/components/view/RecipeIngredients";
import { RecipeTagList } from "@/features/recipe/components/view/RecipeTagList";
import { RecipeTimes } from "@/features/recipe/components/view/RecipeTimes";
import { RecipeFieldsFragment } from "@/gql/graphql";
import { Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface RecipeViewProps {
  recipe: RecipeFieldsFragment;
}

export function RecipeView({ recipe }: RecipeViewProps) {
  let primaryImage = recipe?.photos.find((photo) => {
    photo.isPrimary;
  });

  const tags = [recipe.cuisine, recipe.category, recipe.course].flat();

  return (
    <SingleColumnCentered className="grid grid-cols-1 md:grid-cols-3 gap-14">
      <Image
        src={primaryImage ? primaryImage.url : "/pot.jpg"}
        className="rounded-md"
        alt="recipe photo"
        style={{
          width: "100%",
          height: "auto",
        }}
        width={400}
        height={400}
      />

      <div className="flex flex-col gap-8 justify-between md:col-span-2">
        <div>
          <h1 className="text-3xl font-extrabold mb-2">{recipe?.name}</h1>
          <RecipeTagList tags={tags} />
        </div>

        <div className="grow flex flex-col gap-4">
          <p className="text-lg">{recipe.aggregateLabel?.servings} servings</p>
          <div className="text-lg">
            {recipe.leftoverFridgeLife && (
              <p>{recipe.leftoverFridgeLife} fridge life</p>
            )}
            {recipe.leftoverFreezerLife && (
              <p>{recipe.leftoverFreezerLife} Freezer life</p>
            )}
          </div>
          <RecipeTimes
            prep={recipe.prepTime}
            marinade={recipe.marinadeTime}
            cook={recipe.cookTime}
            total={recipe.totalTime}
          />
        </div>

        <div>
          <Button variant="outline" asChild>
            <Link href={`/recipes/${recipe.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" /> Edit Recipe
            </Link>
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Directions</h2>
        <RecipeIngredients ingredients={recipe?.ingredients} />
      </div>

      <div className="col-span-2">
        <h2 className="text-xl font-bold mb-2">Directions</h2>
        <p>{recipe?.directions}</p>

        <h3 className="text-xl font-bold mt-8 mb-2">Notes</h3>
        <p>{recipe?.notes}</p>
      </div>
      <RecipeNutritionlabel
        className="col-span-3"
        label={recipe?.aggregateLabel}
      />
    </SingleColumnCentered>
  );
}
