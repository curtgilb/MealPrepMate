import { db } from "@/infrastructure/repository/db.js";
import { builder } from "@/presentation/builder.js";

// ============================================ Types ===================================
builder.prismaNode("IngredientCategory", {
  id: { field: "id" },
  fields: (t) => ({
    name: t.exposeString("name"),
    ingredients: t.relation("ingredients"),
  }),
});

// ============================================ Inputs ==================================
// builder.inputType("", {});

// ============================================ Queries =================================
builder.queryFields((t) => ({
  ingredientCategories: t.prismaField({
    type: ["IngredientCategory"],
    resolve: async (query) => {
      //@ts-ignore
      return await db.ingredientCategory.findMany({ ...query });
    },
  }),
}));

// ============================================ Mutations ===============================
// builder.mutationFields((t) => ({}));
