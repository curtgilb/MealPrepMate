import SchemaBuilder from "@pothos/core";
import { createYoga } from "graphql-yoga";
import { createServer } from "node:http";

const builder = new SchemaBuilder({});

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      args: {
        name: t.arg.string(),
      },
      resolve: (parent, { name }) => `hello, ${name || "World"}`,
    }),
  }),
});

const yoga = createYoga({
  schema: builder.toSchema(),
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
const server = createServer(yoga);
server.listen(3000);
