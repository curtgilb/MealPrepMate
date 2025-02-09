import { GraphQLID } from "graphql";
import { DateTimeResolver } from "graphql-scalars";

import { db } from "@/infrastructure/repository/db.js";
// Setup for your schema builder. Does not contain any definitions for types in your schema
import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import RelayPlugin, { decodeGlobalID } from "@pothos/plugin-relay";

import type PrismaTypes from "@/types/PothosTypes.js";
const builder = new SchemaBuilder<{
  DefaultFieldNullability: false;
  PrismaTypes: PrismaTypes;
  Scalars: {
    File: { Input: File; Output: never };
    DateTime: { Input: Date; Output: Date };
    RefID: { Input: string; Output: string };
  };
}>({
  defaultFieldNullability: false,
  plugins: [PrismaPlugin, RelayPlugin],
  prisma: {
    client: db,
    exposeDescriptions: true,
    // use where clause from prismaRelatedConnection for totalCount (will true by default in next major version)
    filterConnectionTotalCount: true,
    // warn when not using a query parameter correctly
    onUnusedQuery: process.env.NODE_ENV === "production" ? null : "warn",
  },
});

builder.queryType({});
builder.mutationType({});
builder.addScalarType("DateTime", DateTimeResolver, {});

builder.scalarType("RefID", {
  serialize: (n) => n,
  parseValue: (n) => {
    if (typeof n !== "string") {
      throw new Error("Invalid Global ID");
    }
    return decodeGlobalID(n).id;
  },
});

builder.scalarType("File", {
  serialize: () => {
    throw new Error("Uploads can only be used as input types");
  },
});

export { builder };
