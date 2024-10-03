import { db } from "../../db.js";
import { builder } from "../builder.js";

// ============================================ Types ===================================
builder.prismaObject("IngredientCategory", {
  fields: (t) => ({
    id: t.exposeString("id"),
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
      return await db.ingredientCategory.findMany({ ...query });
    },
  }),
}));

// ============================================ Mutations ===============================
// builder.mutationFields((t) => ({}));
