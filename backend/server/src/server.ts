import SchemaBuilder from "@pothos/core";
import { PrismaClient, Prisma } from "@prisma/client";
import PrismaPlugin from "@pothos/plugin-prisma";
import { createYoga } from "graphql-yoga";
import { createServer } from "node:http";

import type PrismaTypes from "@pothos/plugin-prisma/generated";
const prisma = new PrismaClient();

const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
    dmmf: Prisma.dmmf,
    exposeDescriptions: { models: true, fields: true },
    filterConnectionTotalCount: true,
    onUnusedQuery: "warn",
  },
});

builder.prismaObject("Cuisine", {
  name: "Cuisine",
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
  }),
});

builder.prismaObject("Recipe", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("title"),
    servings: t.exposeInt("servings"),
    servingsTxt: t.exposeString("servingsText", { nullable: true }),
    prepTime: t.exposeInt("preparationTime", { nullable: true }),
    cookTime: t.exposeInt("cookingTime", { nullable: true }),
    marinadeTime: t.exposeInt("marinadeTime", { nullable: true }),
    notes: t.exposeString("notes", { nullable: true }),
    stars: t.exposeInt("stars", { nullable: true }),
    isFavorite: t.exposeBoolean("isFavorite"),
    ingredientsTxt: t.exposeString("ingredientsTxt", { nullable: true }),
    leftoverFridgeLife: t.exposeInt("leftoverFridgeLife", { nullable: true }),
    directions: t.exposeString("directions", { nullable: true }),
    isVerified: t.exposeBoolean("isVerified", { nullable: true }),
  }),
});

builder.queryType({
  fields: (t) => ({
    cuisines: t.prismaField({
      type: ["Cuisine"],
      resolve: async (query, root, args, ctx, info) =>
        prisma.cuisine.findMany({ ...query }),
    }),
  }),
});

const yoga = createYoga({
  schema: builder.toSchema(),
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
const server = createServer(yoga);
server.listen(3000);
