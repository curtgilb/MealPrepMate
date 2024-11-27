"use client";
import { InfiniteScroll } from "@/components/infinite_scroll/InfiniteScroll";
import {
  recipeSearchFragment,
  searchRecipesQuery,
} from "@/features/recipe/api/Recipe";
import { getFragmentData } from "@/gql";
import {
  RecipeFilter,
  RecipeSearchFieldsFragment,
  SearchRecipesQuery,
} from "@/gql/graphql";
import { cn } from "@/lib/utils";

interface RecipeSearchResultsProps {
  filter: RecipeFilter;
  className?: string;
  renderCard: (recipe: RecipeSearchFieldsFragment) => JSX.Element;
}

export type RecipeSearchItem = NonNullable<
  SearchRecipesQuery["recipes"]
>["edges"][number]["node"];

export function RecipeSearchResults({
  filter,
  renderCard,
  className,
}: RecipeSearchResultsProps) {
  return (
    <InfiniteScroll
      query={searchRecipesQuery}
      className={cn("grid gap-4 grid-cols-autofit", className)}
      variables={{ filters: filter }}
      renderItem={(recipeFragment: RecipeSearchItem) => {
        const recipe = getFragmentData(recipeSearchFragment, recipeFragment);
        return [renderCard(recipe), recipe.id] as const;
      }}
      getConnection={(data) => {
        if (!data?.recipes) return undefined;
        return data.recipes;
      }}
    />
  );
}
