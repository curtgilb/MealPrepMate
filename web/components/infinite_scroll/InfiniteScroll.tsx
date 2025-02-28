"use client";
import { InfiniteScrollPage } from "@/components/infinite_scroll/InfiniteScrollPage";
import { getClient } from "@/ssrGraphqlClient";
import { AnyVariables, TypedDocumentNode, useQuery } from "@urql/next";
import { Fragment } from "react";

export interface QueryVariables {
  after?: string;
  first?: number;
  [prop: string]: any;
}

interface Edge<T> {
  typename?: string | undefined;
  cursor?: string;
  node: T;
}
interface Connection<T> {
  typename?: string | undefined;
  edges: Edge<T>[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor?: string | null | undefined;
  };
}
export interface InfiniteScrollProps<
  TQuery,
  TVariables extends QueryVariables,
  TNode
> {
  query: TypedDocumentNode<TQuery, TVariables>; // URQL query type
  variables: TVariables;
  renderItem: (item: TNode) => [JSX.Element, string | number];
  getConnection: (data: TQuery | undefined) => Connection<TNode> | undefined; // Function to extract connection from the data
  className?: string;
}

export function InfiniteScroll<
  TQuery,
  TVariables extends QueryVariables,
  TNode
>({
  query,
  variables,
  renderItem,
  getConnection,
  className,
}: InfiniteScrollProps<TQuery, TVariables, TNode>) {
  const [results, executeQuery] = useQuery({
    query: query,
    variables: variables,
  });

  if (results.data) {
    const connection = getConnection(results.data);
    const hasNextPage = connection?.pageInfo.hasNextPage ?? false;
    const afterCursor = connection?.pageInfo.endCursor;

    return (
      <div className={className}>
        {/* Render the first list */}
        {connection?.edges.map((edge) => {
          const [component, key] = renderItem(edge.node);
          return <Fragment key={key}>{component}</Fragment>;
        })}

        {/* If it has more, fetch and render the second page */}
        {hasNextPage && (
          <InfiniteScrollPage
            query={query}
            variables={{ ...variables, after: afterCursor }}
            renderItem={renderItem}
            getConnection={getConnection}
          />
        )}
      </div>
    );
  }
  return "No Results";
}
