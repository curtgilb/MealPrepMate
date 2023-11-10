// Setup for your schema builder. Does not contain any definitions for types in your schema
import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import { DateTimeResolver } from "graphql-scalars";
import { db } from "../db.js";
import type PrismaTypes from "../types/PothosTypes.js";

const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Scalars: {
    File: { Input: File; Output: never };
    DateTime: { Input: Date; Output: Date };
  };
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: db,
    // defaults to false, uses /// comments from prisma schema as descriptions
    // for object types, relations and exposed fields.
    // descriptions can be omitted by setting description to false
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
builder.scalarType("File", {
  serialize: () => {
    throw new Error("Uploads can only be used as input types");
  },
});

export { builder };
