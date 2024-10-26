"use client";
import { Card } from "@/components/Card";
import { InfiniteScroll } from "@/components/infinite_scroll/InfiniteScroll";
import {
  recipeSearchFragment,
  searchRecipesQuery,
} from "@/features/recipe/api/Recipe";
import { MacroCardDisplay } from "@/features/recipe/components/recipe_search/MacroCardDisplay";
import { getFragmentData } from "@/gql";
import {
  RecipeFilter,
  RecipeSearchFieldsFragment,
  SearchRecipesQuery,
} from "@/gql/graphql";

interface RecipeSearchResultsProps {
  filter: RecipeFilter;
  verticalOrientation: boolean;
}

type RecipeSearchItem = NonNullable<
  SearchRecipesQuery["recipes"]
>["edges"][number]["node"];

export function RecipeSearchResults({
  filter,
  verticalOrientation,
}: RecipeSearchResultsProps) {
  return (
    <InfiniteScroll
      query={searchRecipesQuery}
      className={
        verticalOrientation
          ? "grid gap-x-4  gap-y-8 grid-cols-autofit-vertical"
          : "grid grid-cols-autofit-horizontal"
      }
      variables={{ filters: filter }}
      renderItem={(recipeFragment: RecipeSearchItem) => {
        const recipe = getFragmentData(recipeSearchFragment, recipeFragment);
        return [
          <RecipeSearchItem
            key={recipe.id}
            recipe={recipe}
            verticalOrientation={verticalOrientation}
          />,
          recipe.id,
        ] as const;
      }}
      getConnection={(data) => {
        if (!data?.recipes) return undefined;
        return data.recipes;
      }}
    />
  );
}

interface RecipeSearchItemProps {
  recipe: RecipeSearchFieldsFragment;
  verticalOrientation: boolean;
}

export function RecipeSearchItem({
  recipe,
  verticalOrientation,
}: RecipeSearchItemProps) {
  return (
    <Card
      href={`/recipes/${recipe.id}`}
      vertical={verticalOrientation}
      image={{
        grid: false,
        placeholderUrl: "/placeholder_recipe.jpg",
        altText: `Image of ${recipe.name}`,
        urls: recipe?.photos
          ?.filter((image) => image.url)
          ?.map(
            (image) => `${process.env.NEXT_PUBLIC_STORAGE_URL}${image.url}`
          ),
      }}
    >
      <div className="flex flex-col justify-between">
        <div>
          <p className="group-hover:underline font-semibold">{recipe.name}</p>
          <p className="text-sm min-h-16 ">
            {recipe.aggregateLabel?.servings} servings
          </p>
        </div>

        {/* <MacroCardDisplay label={recipe.aggregateLabel} /> */}
      </div>
    </Card>
  );
}
