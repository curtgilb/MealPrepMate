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

interface RecipeSearchResultsProps {
  filter: RecipeFilter;
  renderCard: (recipe: RecipeSearchFieldsFragment) => JSX.Element;
}

export type RecipeSearchItem = NonNullable<
  SearchRecipesQuery["recipes"]
>["edges"][number]["node"];

export function RecipeSearchResults({
  filter,
  renderCard,
}: RecipeSearchResultsProps) {
  return (
    <InfiniteScroll
      query={searchRecipesQuery}
      className="grid gap-4 grid-cols-autofit"
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
