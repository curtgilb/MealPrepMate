"use client";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { SquareImage } from "@/components/images/SquareImage";
import { RichTextEditor } from "@/components/rich_text/RichTextEditor";
import { Button } from "@/components/ui/button";
import { recipeIngredientFragment } from "@/features/recipe/api/RecipeIngredient";
import { RecipeNutritionlabel } from "@/features/recipe/components/nutrition_label/RecipeNutritionLabel";
import { Counter } from "@/features/recipe/components/view/Counter";
import { LeftoverLifespan } from "@/features/recipe/components/view/LeftoverLifespan";
import RecipeIngredients from "@/features/recipe/components/view/RecipeIngredients";
import { RecipeMacroSummary } from "@/features/recipe/components/view/RecipeMacroSummary";
import { RecipeTagList } from "@/features/recipe/components/view/RecipeTagList";
import { RecipeTimes } from "@/features/recipe/components/view/RecipeTimes";
import { SourceLink } from "@/features/recipe/components/view/SourceLink";
import { getFragmentData } from "@/gql";
import { RecipeFieldsFragment } from "@/gql/graphql";

interface Recipe {
  recipe: RecipeFieldsFragment | undefined | null;
}

export function Recipe({ recipe }: Recipe) {
  const [scale, setScale] = useState(1);
  const [servings, setServings] = useState(
    recipe?.aggregateLabel?.servings ?? 1
  );

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
    <div className="grid grid-cols-1 md:grid-cols-[24rem_1fr] gap-x-24 gap-y-14">
      <SquareImage url={imageUrl} altText={`Image of ${recipe?.name}`} />

      {/* Basic info */}
      <div className="flex flex-col gap-10 justify-between max-w-prose">
        <div className="flex gap-8 justify-between">
          <div>
            <h1 className="font-serif text-3xl font-extrabold">
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

        {/* Servings adjuster */}
        <div className="flex gap-12">
          <div>
            <h2 className="text-lg font-serif font-bold mb-2">Servings</h2>
            <Counter
              servings={servings}
              onChange={(update) => setServings(update)}
            />
          </div>

          <div>
            <h2 className="text-lg font-serif font-bold mb-2">Scale</h2>
            <Counter
              servings={scale}
              step={0.25}
              onChange={(update) => setScale(update)}
            />
          </div>
        </div>

        {/* Time */}
        <div>
          <h2 className="text-lg font-serif font-bold mb-2">Time</h2>
          <RecipeTimes
            prep={recipe?.prepTime}
            marinade={recipe?.marinadeTime}
            cook={recipe?.cookTime}
          />
        </div>

        {/* Nutrition Per serving */}
        <div>
          <h2 className="text-lg font-serif font-bold mb-2">
            Nutrition per serving
          </h2>
          <RecipeMacroSummary
            nutritionLabel={recipe?.aggregateLabel}
          ></RecipeMacroSummary>
        </div>
      </div>

      {/* Recipe Ingredients */}
      <div>
        <h2 className="text-lg font-serif font-bold mb-2">Ingredients</h2>
        <RecipeIngredients ingredients={ingredients} scale={scale} />
      </div>

      {/* Directions, notes, nutrition */}
      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-serif font-bold mb-2 ">Directions</h2>
          <RichTextEditor
            value={recipe?.directions}
            editable={false}
            onChange={() => {}}
          />
        </div>

        <div>
          <h2 className="text-lg font-serif font-bold mt-8 mb-2">Notes</h2>
          <p className="max-w-prose">{recipe?.notes}</p>
        </div>

        <div>
          <h2 className="text-lg font-serif font-bold mt-8 mb-2">
            Leftover Lifespan
          </h2>
          <LeftoverLifespan
            fridge={recipe?.leftoverFridgeLife}
            freezer={recipe?.leftoverFreezerLife}
          />
        </div>

        <div>
          <h2 className="text-lg font-serif font-bold mt-8 mb-2">Source</h2>
          <SourceLink source={recipe?.source} />
        </div>
      </div>

      {/* Nutrition Label */}
      <div className="col-start-2 max-w-prose">
        <h2 className="text-lg font-serif font-bold mb-2 ">Nutrition Facts</h2>
        <RecipeNutritionlabel label={recipe?.aggregateLabel} />
      </div>
    </div>
  );
}
