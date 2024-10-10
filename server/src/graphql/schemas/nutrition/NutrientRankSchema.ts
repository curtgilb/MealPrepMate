import { db } from "@/infrastructure/repository/db.js";
import { builder } from "@/graphql/builder.js";
import {
  RankedNutrientInput,
  setRankedNutrients,
} from "@/application/services/nutrition/NutrientService.js";

// ============================================ Types ===================================

// ============================================ Inputs ==================================
const rankedNutrientInput = builder
  .inputRef<RankedNutrientInput>("RankedNutrientInput")
  .implement({
    fields: (t) => ({
      nutrientId: t.string({ required: true }),
      rank: t.int({ required: true }),
    }),
  });

// ============================================ Queries =================================
builder.queryFields((t) => ({
  rankedNutrients: t.prismaField({
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
      return setRankedNutrients(args.nutrients, query);
    },
  }),
}));
