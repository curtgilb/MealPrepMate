import { FragmentType, graphql, useFragment } from "@/gql";
import { RecipeFilter, RecipeSearchFieldsFragment } from "@/gql/graphql";
import { recipeSearchFragment, searchRecipes } from "@/graphql/recipe/queries";
import { useQuery } from "@urql/next";
import { LoadingCards } from "../generics/LoadingCards";
import { RecipeCard } from "../RecipeCard";
import { useCallback } from "react";
import { cn } from "@/lib/utils";

interface RecipeSearchResultsProps {
  filters?: RecipeFilter;
  Component: React.FC<{ recipe: RecipeSearchFieldsFragment }>;
  vertical: boolean;
}

export function RecipeSearchResults({
  filters,
  Component,
  vertical,
}: RecipeSearchResultsProps) {
  const [result] = useQuery({
    query: searchRecipes,
    variables: { filters, pagination: { take: 50, offset: 0 } },
  });
  const { data, fetching, error } = result;
  const recipes = useFragment(recipeSearchFragment, data?.recipes.recipes);

  if (fetching) return <LoadingCards vertical={vertical} />;

  if (!recipes || recipes?.length == 0) return <p>No results</p>;

  return (
    <div
      className={cn(
        "grid gap-4",
        vertical ? "grid-cols-autofit-vertical" : "grid-cols-autofit-horizontal"
      )}
    >
      {recipes.map((recipe) => {
        return <Component key={recipe.id} recipe={recipe} />;
      })}

      {/* The <SearchPage> component receives the same props, plus the `afterCursor` for its variables */}
      {data?.recipes.itemsRemaining ? (
        <SearchPage
          filters={filters}
          Component={Component}
          take={25}
          skip={data.recipes.nextOffset}
          vertical={vertical}
        />
      ) : result.fetching ? (
        <LoadingCards vertical={vertical} />
      ) : null}
    </div>
  );
}

interface SearchPageProps extends RecipeSearchResultsProps {
  take: number;
  skip: number | null | undefined;
}

function SearchPage({
  filters,
  Component,
  take,
  skip,
  vertical,
}: SearchPageProps) {
  const [results, executeQuery] = useQuery({
    query: searchRecipes,
    requestPolicy: "cache-only",
    pause: !skip,
    variables: {
      filters,
      pagination: { offset: skip ?? 0, take: take },
    },
  });
  const recipes = useFragment(
    recipeSearchFragment,
    results.data?.recipes.recipes
  );

  const onLoadMore = useCallback(() => {
    executeQuery({ requestPolicy: "cache-first" });
  }, [executeQuery]);

  if (results.fetching) {
    return <LoadingCards vertical={vertical} />;
  }
  if (results.error) return <p>Oh no... {results.error.message}</p>;

  return (
    <>
      {recipes?.map((recipe) => (
        <Component key={recipe.id} recipe={recipe} />
      ))}

      {results.data?.recipes.itemsRemaining ? (
        <SearchPage
          filters={filters}
          Component={Component}
          take={take}
          skip={results.data.recipes.nextOffset}
          vertical={vertical}
        />
      ) : null}

      {!results.data?.recipes && !results.fetching ? (
        <LoadingCards vertical={vertical} onView={onLoadMore} />
      ) : null}
    </>
  );
}
