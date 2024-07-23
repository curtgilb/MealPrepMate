import { db } from "../../db.js";
import { builder } from "../builder.js";

// ============================================ Types ===================================

// ============================================ Inputs ==================================
const rankedNutrientInput = builder.inputType("RankedNutrientInput", {
  fields: (t) => ({
    nutrientId: t.string({ required: true }),
    rank: t.int({ required: true }),
  }),
});

// ============================================ Queries =================================
builder.queryFields((t) => ({
  getRankedNutrients: t.prismaField({
    type: ["Nutrient"],
    resolve: async (query) => {
      return await db.nutrient.findMany({
        where: { ranking: { isNot: null } },
        orderBy: { ranking: { rank: "desc" } },
        ...query,
      });
    },
  }),
}));

// ============================================ Mutations ===============================
builder.mutationFields((t) => ({
  setRankedNutrients: t.prismaField({
    type: ["Nutrient"],
    args: {
      nutrients: t.arg({ type: [rankedNutrientInput], required: true }),
    },
    resolve: async (query, root, args) => {
      const [deleted, createMany, created] = await db.$transaction([
        db.rankedNutrient.deleteMany({}),
        db.rankedNutrient.createMany({
          data: args.nutrients.map((ingredient) => ({
            rank: ingredient.rank,
            nutrientId: ingredient.nutrientId,
          })),
        }),
        db.nutrient.findMany({
          where: {
            ranking: { isNot: null },
          },
          orderBy: { ranking: { rank: "desc" } },
          ...query,
        }),
      ]);
      return created;
    },
  }),
}));
