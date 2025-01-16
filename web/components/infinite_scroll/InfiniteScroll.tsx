"use client";
import { InfiniteScrollPage } from "@/components/infinite_scroll/InfiniteScrollPage";
import { Fragment, HTMLAttributes } from "react";
import { TypedDocumentNode, useQuery } from "@urql/next";

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
> extends HTMLAttributes<HTMLDivElement> {
  query: TypedDocumentNode<TQuery, TVariables>; // URQL query type
  variables: TVariables; // Variables to pass with the query
  renderItem: (item: TNode) => [JSX.Element, string | number]; // 
  getConnection: (data: TQuery | undefined) => Connection<TNode> | undefined; // Function to extract connection from the data
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
  ...rest
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
      <div {...rest}>
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
