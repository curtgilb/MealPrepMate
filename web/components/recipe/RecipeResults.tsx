import { FragmentType, graphql, useFragment } from "@/gql";
import { RecipeFilter } from "@/gql/graphql";
import {
  recipeSearchFragment,
  searchRecipes,
} from "@/graphql/recipe/getRecipe";
import { useQuery } from "@urql/next";
import { LoadingCards } from "../generics/LoadingCards";
import RecipeCard from "./RecipeCard";
import { useCallback } from "react";

interface RecipeSearchResultsProps {
  filters?: RecipeFilter;
  smallCards: boolean;
}

export function RecipeSearchResults({
  filters,
  smallCards = true,
}: RecipeSearchResultsProps) {
  const [result] = useQuery({
    query: searchRecipes,
    variables: { filters, pagination: { take: 50, offset: 0 } },
  });

  const { data, fetching, error } = result;
  if (fetching) return <LoadingCards small={true} />;
  const recipes = data?.recipes.recipes as FragmentType<
    typeof recipeSearchFragment
  >[];
  if (!recipes || recipes?.length == 0) return <p>No results</p>;
  return (
    <>
      {recipes.map((recipe) => {
        return (
          <RecipeCard key={(recipe as { id: string }).id} recipe={recipe} />
        );
      })}

      {/* The <SearchPage> component receives the same props, plus the `afterCursor` for its variables */}
      {data?.recipes.itemsRemaining ? (
        <SearchPage
          filters={filters}
          take={25}
          skip={data.recipes.nextOffset}
          smallCards={smallCards}
        />
      ) : result.fetching ? (
        <LoadingCards small={true} />
      ) : null}
    </>
  );
}

interface SearchPageProps extends RecipeSearchResultsProps {
  take: number;
  skip: number | null | undefined;
}

function SearchPage({ filters, take, skip, smallCards }: SearchPageProps) {
  const [results, executeQuery] = useQuery({
    query: searchRecipes,
    requestPolicy: "cache-only",
    pause: !skip,
    variables: {
      filters,
      pagination: { offset: skip ?? 0, take: take },
    },
  });

  const onLoadMore = useCallback(() => {
    executeQuery({ requestPolicy: "cache-first" });
  }, [executeQuery]);

  if (results.fetching) {
    return <LoadingCards small={true} />;
  }
  if (results.error) return <p>Oh no... {results.error.message}</p>;

  const recipes = results.data?.recipes.recipes;
  return (
    <>
      {recipes?.map((recipe) => (
        <RecipeCard key={(recipe as { id: string }).id} recipe={recipe} />
      ))}

      {results.data?.recipes.itemsRemaining ? (
        <SearchPage
          filters={filters}
          take={take}
          skip={results.data.recipes.nextOffset}
          smallCards={smallCards}
        />
      ) : null}

      {!results.data?.recipes && !results.fetching ? (
        <LoadingCards small={true} onView={onLoadMore} />
      ) : null}
    </>
  );
}
