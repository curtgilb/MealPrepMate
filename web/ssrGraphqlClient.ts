import { cacheExchange, createClient, fetchExchange } from "@urql/core";
import { registerUrql } from "@urql/next/rsc";

const makeClient = () => {
  return createClient({
    url: process.env.SSR_API_ENDPOINT ?? "",
    exchanges: [cacheExchange, fetchExchange],
    fetchOptions: { cache: "no-store" },
  });
};

const { getClient } = registerUrql(makeClient);

export { getClient };
