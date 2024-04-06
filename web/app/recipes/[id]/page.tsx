import SingleColumnCentered from "@/components/layouts/single-column-centered";
import React from "react";
import { cacheExchange, createClient, fetchExchange, gql } from "@urql/core";
import { registerUrql } from "@urql/next/rsc";
import { graphql } from "@/gql";

const getRecipe = graphql(`query `);

const makeClient = () => {
  return createClient({
    url: "https://localhost:3025/graphql",
    exchanges: [cacheExchange, fetchExchange],
  });
};

const { getClient } = registerUrql(makeClient);

export default async function Recipe({ params }: { params: { id: string } }) {
  const result = await getClient().query(PokemonsQuery, {});
  return (
    <SingleColumnCentered>
      <h1>{params.id}</h1>
    </SingleColumnCentered>
  );
}
