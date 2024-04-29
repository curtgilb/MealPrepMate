import { useQuery } from "@urql/next";
import { graphql } from "@/gql";
import IngredientCard from "@/components/ingredient/IngredientCard";
import { useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "@/components/ui/skeleton";
import { SmallCard } from "../generics/SmallCard";

function Loading() {
  return (
    <>
      <SmallCard imageUrl="adsf" loading={true} />
      <SmallCard imageUrl="adsf" loading={true} />
      <SmallCard imageUrl="adsf" loading={true} />
      <SmallCard imageUrl="adsf" loading={true} />
      <SmallCard imageUrl="adsf" loading={true} />
      <SmallCard imageUrl="adsf" loading={true} />
    </>
  );
}

const ingredientsListQuery = graphql(/* GraphQL */ `
  query fetchIngredients($pagination: OffsetPagination!, $search: String) {
    ingredients(pagination: $pagination, search: $search) {
      ingredients {
        id
        name
      }
      itemsRemaining
      nextOffset
    }
  }
`);

// This is the <SearchRoot> component that we render in `./App.jsx`.
// It accepts our variables as props.
export const SearchRoot = ({ searchTerm = "", resultsPerPage = 50 }) => {
  const [result] = useQuery({
    query: ingredientsListQuery,
    variables: {
      pagination: { offset: 0, take: resultsPerPage },
      search: searchTerm,
    },
  });

  const { data, fetching, error } = result;

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;
  const ingredients = data?.ingredients.ingredients;
  return (
    <>
      {ingredients?.length === 0 ? <strong>No Results</strong> : null}

      {ingredients?.map((ingredient) => (
        <IngredientCard
          key={ingredient.id}
          id={ingredient.id}
          name={ingredient.name}
        />
      ))}

      {/* The <SearchPage> component receives the same props, plus the `afterCursor` for its variables */}
      {data?.ingredients.itemsRemaining ? (
        <SearchPage
          searchTerm={searchTerm}
          take={resultsPerPage}
          skip={data.ingredients.nextOffset}
        />
      ) : result.fetching ? (
        <Loading />
      ) : null}
    </>
  );
};

function SearchPage({
  searchTerm,
  take,
  skip,
}: {
  searchTerm: string;
  take: number;
  skip: number | null | undefined;
}) {
  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 1,
    triggerOnce: true,
  });
  // Each <SearchPage> fetches its own page results!
  const [results, executeQuery] = useQuery({
    query: ingredientsListQuery,
    // Initially, we *only* want to display results if, they're cached
    requestPolicy: "cache-only",
    // We don't want to run the query if we don't have a cursor (in this example, this will never happen)
    pause: !skip,
    variables: {
      search: searchTerm,
      pagination: { offset: skip ?? 0, take: take },
    },
  });

  // We only load more results, by allowing the query to make a network request, if
  // a button has pressed.
  // In your app, you may want to do this automatically if the user can see the end of
  // your list, e.g. via an IntersectionObserver.
  const onLoadMore = useCallback(() => {
    // This tells the query above to execute and instead of `cache-only`, which forbids
    // network requests, we now allow them.
    executeQuery({ requestPolicy: "cache-first" });
  }, [executeQuery]);

  if (results.fetching) {
    return <Loading />;
  }
  if (results.error) return <p>Oh no... {results.error.message}</p>;

  const ingredients = results.data?.ingredients.ingredients;
  return (
    <>
      {/* If our query has nodes, we render them here. The page renders its own results */}
      {ingredients?.map((ingredient) => (
        <IngredientCard
          key={ingredient.id}
          id={ingredient.id}
          name={ingredient.name}
        />
      ))}

      {/* If we have a next page, we now render it recursively! */}
      {/* As before, the next <SearchPage> will not fetch immediately, but only query from cache */}
      {results.data?.ingredients.itemsRemaining ? (
        <SearchPage
          searchTerm={searchTerm}
          take={take}
          skip={results.data.ingredients.nextOffset}
        />
      ) : results.fetching ? (
        <em>Loading...</em>
      ) : null}

      {!results.data?.ingredients && !results.fetching ? (
        <>
          <div ref={ref}></div>
          <Loading />
        </>
      ) : null}
    </>
  );
}
