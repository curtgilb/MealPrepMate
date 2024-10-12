import { z } from "zod";
import { db } from "@/infrastructure/repository/db.js";
import { toTitleCase } from "@/application/util/utils.js";
import { cleanedStringSchema } from "@/validations/utilValidations.js";
import { builder } from "@/graphql/builder.js";

// ============================================ Types ===================================
builder.prismaObject("Cuisine", {
  name: "Cuisine",
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    recipes: t.relation("recipes"),
  }),
});

// ============================================ Inputs ==================================

// ============================================ Queries =================================
builder.queryFields((t) => ({
  cuisines: t.prismaField({
    type: ["Cuisine"],
    args: {
      searchString: t.arg.string(),
    },
    validate: {
      schema: z.object({ searchString: z.string().optional() }),
    },
    resolve: async (query, root, args) => {
      //@ts-ignore
      return await db.cuisine.findMany({
        where: {
          name: args.searchString
            ? {
                contains: args.searchString,
                mode: "insensitive",
              }
            : undefined,
        },
        orderBy: { name: "asc" },
        ...query,
      });
    },
  }),
}));

// ============================================ Mutations ===============================
builder.mutationFields((t) => ({
  createCuisine: t.prismaField({
    type: ["Cuisine"],
    args: {
      name: t.arg.string({ required: true }),
    },
    validate: {
      schema: z.object({ name: cleanedStringSchema(30, toTitleCase) }),
    },
    resolve: async (query, root, args) => {
      await db.cuisine.create({ data: { name: args.name } });
      return db.cuisine.findMany({ ...query, orderBy: { name: "asc" } });
    },
  }),
  deleteCuisine: t.prismaField({
    type: ["Cuisine"],
    args: {
      cuisineId: t.arg.string({ required: true }),
    },
    validate: {
      schema: z.object({ cuisineId: z.string().cuid() }),
    },
    resolve: async (query, root, args) => {
      await db.cuisine.delete({ where: { id: args.cuisineId } });
      return await db.cuisine.findMany({ ...query, orderBy: { name: "asc" } });
    },
  }),
}));
