import { cacheExchange, createClient, fetchExchange, gql } from "@urql/core";
import { registerUrql } from "@urql/next/rsc";

const makeClient = () => {
  return createClient({
    url: "http://localhost:3025/graphql",
    exchanges: [cacheExchange, fetchExchange],
    fetchOptions: { cache: "no-store" },
  });
};

const { getClient } = registerUrql(makeClient);

export { getClient };
