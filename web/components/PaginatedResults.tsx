"use client";
import { AnyVariables, TypedDocumentNode, useQuery } from "@urql/next";

interface Edge<T> {
  cursor: string;
  node: T;
}

interface Connection<T> {
  edges: Edge<T>[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string;
  };
}

interface InfiniteScrollProps<TQuery, TVariables extends AnyVariables, TNode> {
  query: TypedDocumentNode<TQuery, TVariables>; // URQL query type
  variables: TVariables;
  renderItem: (item: TNode) => JSX.Element;
  getConnection: (data: TQuery) => Connection<TNode>; // Function to extract connection from the data
}

export function InfiniteScroll<TQuery, TVariables extends AnyVariables, TNode>({
  query,
  variables,
  renderItem,
  getConnection,
}: InfiniteScrollProps<TQuery, TVariables, TNode>) {
  const [result] = useQuery({ query: query, variables: variables });

  if (result.data) {
    const connection = getConnection(result.data);

    return (
      <div>
        {connection.edges.map((edge) => {
          return renderItem(edge.node);
        })}
      </div>
    );
  }

  return "No Results";
}
