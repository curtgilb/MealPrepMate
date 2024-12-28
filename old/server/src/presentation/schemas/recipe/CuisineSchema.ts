import { db } from '@/infrastructure/repository/db.js';
import { builder } from '@/presentation/builder.js';
import { DeleteResult } from '@/presentation/schemas/common/MutationResult.js';
import { encodeGlobalID } from '@pothos/plugin-relay';

// ============================================ Types ===================================
builder.prismaNode("Cuisine", {
  id: { field: "id" },
  name: "Cuisine",
  fields: (t) => ({
    name: t.exposeString("name"),
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
    resolve: async (query, root, args) => {
      await db.cuisine.create({ data: { name: args.name } });
      return db.cuisine.findMany({ ...query, orderBy: { name: "asc" } });
    },
  }),
  deleteCuisine: t.field({
    type: DeleteResult,
    args: {
      cuisineId: t.arg.globalID({ required: true }),
    },
    resolve: async (root, args) => {
      const guid = encodeGlobalID(args.cuisineId.typename, args.cuisineId.id);

      await db.category.delete({ where: { id: args.cuisineId.id } });
      return { id: guid, success: true };
    },
  }),
}));
