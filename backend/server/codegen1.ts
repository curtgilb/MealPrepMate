import type { CodegenConfig } from "@graphql-codegen/cli";
import { printSchema } from "graphql";
import { schema } from "./src/graphql/Schema.js";

const config: CodegenConfig = {
  overwrite: true,
  schema: printSchema(schema),
  generates: {
    "./src/gql.ts": {
      plugins: ["typescript", "typescript-resolvers"],
    },
  },
};

export default config;
