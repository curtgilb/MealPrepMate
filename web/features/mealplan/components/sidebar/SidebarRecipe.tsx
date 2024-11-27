"use client";

import { RectangleImage } from "@/components/images/RectangleImage";
import { RichTextContent } from "@/components/RichTextContent";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { recipeIngredientFragment } from "@/features/recipe/api/RecipeIngredient";
import { Counter } from "@/features/recipe/components/view/Counter";
import RecipeIngredients from "@/features/recipe/components/view/RecipeIngredients";
import { RecipeMacroSummary } from "@/features/recipe/components/view/RecipeMacroSummary";
import { getFragmentData } from "@/gql";
import {
  GetRecipeBaiscInfoQuery,
  MealPlanRecipeFieldsFragment,
} from "@/gql/graphql";

interface SidebarRecipeProps {
  recipe:
    | GetRecipeBaiscInfoQuery["recipe"]
    | MealPlanRecipeFieldsFragment["originalRecipe"];
  scale: number;
  servings: number;
  setScale: (scale: number) => void;
  setServings: (servings: number) => void;
}

export function SidebarRecipe({
  recipe,
  scale,
  servings,
  setScale,
  setServings,
}: SidebarRecipeProps) {
  let imageUrl =
    recipe?.photos && recipe.photos.length > 0
      ? `${process.env.NEXT_PUBLIC_STORAGE_URL}${recipe.photos[0].url}`
      : "/placeholder_recipe.jpg";

  const ingredients = getFragmentData(
    recipeIngredientFragment,
    recipe?.ingredients
  );

  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-6 pb-4">
        <RectangleImage
          url={imageUrl}
          altText={`Image of ${recipe?.name}`}
          height={224}
          targetWidth={351}
        />
        <p className="font-serif text-lg font-extrabold">{recipe?.name}</p>

        <div className="flex gap-6 justify-around">
          <div>
            <h2 className=" font-serif  mb-2">Servings</h2>
            <Counter
              servings={servings}
              onChange={(update) => setServings(update)}
            />
          </div>

          <div>
            <h2 className=" font-serif  mb-2">Scale</h2>
            <Counter
              servings={scale}
              step={0.25}
              onChange={(update) => setScale(update)}
            />
          </div>
        </div>

        <RecipeMacroSummary
          className="justify-around text-center"
          nutritionLabel={recipe?.aggregateLabel}
          servings={servings}
          scaleFactor={scale}
        />
        {/* 
      <LeftoverLifespan
        fridge={recipe?.leftoverFridgeLife}
        freezer={recipe?.leftoverFreezerLife}
      /> */}

        <Accordion type="single" collapsible>
          <AccordionItem value="ingredients">
            <AccordionTrigger>Ingredients</AccordionTrigger>
            <AccordionContent>
              <RecipeIngredients
                ingredients={ingredients}
                scale={scale}
                className="text-sm font-light"
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="directions">
            <AccordionTrigger>Directions</AccordionTrigger>
            <AccordionContent>
              <RichTextContent
                className="text-sm font-light leading-relaxed"
                content={recipe?.directions ?? ""}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="notes">
            <AccordionTrigger>Notes</AccordionTrigger>
            <AccordionContent>
              <RichTextContent
                className="text-sm font-light leading-relaxed"
                content={recipe?.notes ?? ""}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </ScrollArea>
  );
}
