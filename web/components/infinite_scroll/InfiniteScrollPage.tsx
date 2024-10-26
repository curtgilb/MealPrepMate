"use client";
import {
  InfiniteScrollProps,
  QueryVariables,
} from "@/components/infinite_scroll/InfiniteScroll";
import { Loader } from "@/components/infinite_scroll/Loader";
import { useQuery } from "@urql/next";
import { Fragment, useCallback } from "react";

export function InfiniteScrollPage<
  TQuery,
  TVariables extends QueryVariables,
  TNode
>({
  query,
  variables,
  renderItem,
  getConnection,
}: InfiniteScrollProps<TQuery, TVariables, TNode>) {
  const [results, executeQuery] = useQuery({
    query: query,
    requestPolicy: "cache-only",
    pause: !variables.after,
    variables: variables,
  });
  console.log("Page data ", results.data);

  const onLoadMore = useCallback(() => {
    console.log("fetching more");
    executeQuery({ requestPolicy: "cache-first" });
  }, [executeQuery]);

  if (results.fetching) {
    return <Loader />;
  }

  const connection = getConnection(results.data);
  const hasNextPage = connection?.pageInfo.hasNextPage ?? false;
  const afterCursor = connection?.pageInfo.endCursor;

  return (
    <>
      {connection?.edges.map((edge) => {
        const [component, key] = renderItem(edge.node);
        return <Fragment key={key}>{component}</Fragment>;
      })}
      {hasNextPage && (
        <InfiniteScrollPage
          query={query}
          variables={{ ...variables, after: afterCursor }}
          renderItem={renderItem}
          getConnection={getConnection}
        />
      )}
      {!connection && !results.fetching ? <Loader onView={onLoadMore} /> : null}
    </>
  );
}
