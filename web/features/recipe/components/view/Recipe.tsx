"use client";
import { FilledImage } from "@/components/images/FilledImage";
import SingleColumnCentered from "@/components/layouts/single-column-centered";
import { RichTextEditor } from "@/components/rich_text/RichTextEditor";
import { Button } from "@/components/ui/button";
import { recipeIngredientFragment } from "@/features/recipe/api/RecipeIngredient";
import { RecipeNutritionlabel } from "@/features/recipe/components/nutrition_label/RecipeNutritionLabel";
import { LeftoverLifespan } from "@/features/recipe/components/view/LeftoverLifespan";
import RecipeIngredients from "@/features/recipe/components/view/RecipeIngredients";
import { RecipeNutritionSummary } from "@/features/recipe/components/view/RecipeNutritionSummary";
import { RecipeTagList } from "@/features/recipe/components/view/RecipeTagList";
import { RecipeTimes } from "@/features/recipe/components/view/RecipeTimes";
import { ServingsAjuster } from "@/features/recipe/components/view/ServingsAdjuster";
import { SourceLink } from "@/features/recipe/components/view/SourceLink";
import { getFragmentData } from "@/gql";
import { RecipeFieldsFragment } from "@/gql/graphql";
import { Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Recipe {
  recipe: RecipeFieldsFragment | undefined | null;
}

export function Recipe({ recipe }: Recipe) {
  let imageUrl =
    recipe?.photos && recipe.photos.length > 0
      ? `${process.env.NEXT_PUBLIC_STORAGE_URL}${recipe.photos[0].url}`
      : "/placeholder_recipe.jpg";

  const tags = [recipe?.cuisine, recipe?.category, recipe?.course].flat();
  const ingredients = getFragmentData(
    recipeIngredientFragment,
    recipe?.ingredients
  );

  return (
    <SingleColumnCentered className="grid grid-cols-1 md:grid-cols-3 gap-14">
      <FilledImage
        url={imageUrl}
        altText={`Image of ${recipe?.name}`}
        containerCss="w-96 h-96"
      />

      <div className="flex flex-col gap-8 justify-between md:col-span-2 max-w-prose">
        <div className="flex gap-8 justify-between">
          <div>
            <h1 className="font-serif text-3xl font-extrabold mb-2">
              {recipe?.name}
            </h1>
            <RecipeTagList tags={tags} />
          </div>
          {recipe && (
            <Button variant="outline" asChild>
              <Link href={`/recipes/${recipe.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </Link>
            </Button>
          )}
        </div>

        <div className="grow flex flex-col gap-6">
          <div className="flex gap-12">
            <div>
              <h2 className="text-xl font-serif font-bold mb-2">Servings</h2>
              <ServingsAjuster
                servings={recipe?.aggregateLabel?.servings ?? 1}
                onChange={(servings) => console.log(servings)}
              />
            </div>

            <div>
              <h2 className="text-xl font-serif font-bold mb-2">Scale</h2>
              <ServingsAjuster
                servings={1}
                onChange={(servings) => console.log(servings)}
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-serif font-bold mb-2">Time</h2>
            <RecipeTimes
              prep={recipe?.prepTime}
              marinade={recipe?.marinadeTime}
              cook={recipe?.cookTime}
            />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold mb-2">
              Nutrition per serving
            </h2>
            <RecipeNutritionSummary
              nutritionLabel={recipe?.aggregateLabel}
            ></RecipeNutritionSummary>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-serif font-bold mb-2">Ingredients</h2>
        <RecipeIngredients ingredients={ingredients} />
      </div>

      <div className="col-span-2">
        <h2 className="text-xl font-serif font-bold mb-2 ">Directions</h2>
        <RichTextEditor
          value={recipe?.directions}
          editable={false}
          onChange={() => {}}
        />

        <h2 className="text-xl font-serif font-bold mt-8 mb-2">Notes</h2>
        <p className="max-w-prose">{recipe?.notes}</p>

        <h3 className="text-xl font-serif font-bold mt-8 mb-2">
          Leftover Lifespan
        </h3>
        <LeftoverLifespan
          fridge={recipe?.leftoverFridgeLife}
          freezer={recipe?.leftoverFreezerLife}
        />

        <h2 className="text-xl font-serif font-bold mt-8 mb-2">Source</h2>
        <SourceLink source={recipe?.source} />
      </div>
      <div>
        <h2 className="text-xl font-serif font-bold mb-2 ">Nutrition Facts</h2>
        <RecipeNutritionlabel
          className="col-span-3"
          label={recipe?.aggregateLabel}
        />
      </div>
    </SingleColumnCentered>
  );
}
