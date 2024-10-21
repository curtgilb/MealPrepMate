import type { CodegenConfig } from "@graphql-codegen/cli";
import { printSchema } from "graphql";
import { schema } from "./src/presentation/Schema.js";

const config: CodegenConfig = {
  schema: printSchema(schema),
  config: {
    scalars: { DateTime: "Date", File: "File" },
  },
  generates: {
    "./src/types/gql.ts": {
      plugins: ["typescript", "typescript-resolvers"],
    },
    "./src/graphql/schema.graphql": {
      plugins: ["schema-ast"],
    },
  },
};

export default config;

// const config: CodegenConfig = {
//   overwrite: true,
//   schema: printSchema(schema),
//   generates: {
//     "./src/gql.ts": {
//       plugins: ["typescript", "typescript-resolvers"],
//     },
//   },
// };

// export default config;
