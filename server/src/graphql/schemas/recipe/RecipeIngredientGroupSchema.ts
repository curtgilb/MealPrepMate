import { db } from "@/infrastructure/repository/db.js";
import { builder } from "@/graphql/builder.js";
import { deleteResult } from "@/graphql/schemas/common/Pagination.js";

// ============================================ Types ===================================
builder.prismaObject("RecipeIngredientGroup", {
  fields: (t) => ({
    id: t.exposeString("id"),
    name: t.exposeString("name"),
    recipe: t.relation("recipe"),
    ingredients: t.relation("ingredients"),
    lablel: t.relation("nutritionLabel"),
  }),
});

// ============================================ Inputs ==================================
// builder.inputType("", {});

// ============================================ Queries =================================
// builder.queryFields((t) => ({}));

// ============================================ Mutations ===============================
builder.mutationFields((t) => ({
  createIngredientGroup: t.prismaField({
    type: "RecipeIngredientGroup",
    args: {
      recipeId: t.arg.string({ required: true }),
      name: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args) => {
      return await db.recipeIngredientGroup.create({
        data: {
          recipe: { connect: { id: args.recipeId } },
          name: args.name,
        },
        ...query,
      });
    },
  }),
  editRecipeIngredientGroup: t.prismaField({
    type: "RecipeIngredientGroup",
    args: {
      groupId: t.arg.string({ required: true }),
      name: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args) => {
      return await db.recipeIngredientGroup.update({
        where: { id: args.groupId },
        data: { name: args.name },
        ...query,
      });
    },
  }),
  deleteRecipeIngredientGroup: t.field({
    type: deleteResult,
    args: {
      groupId: t.arg.string({ required: true }),
    },
    resolve: async (root, args) => {
      try {
        await db.recipeIngredientGroup.delete({ where: { id: args.groupId } });
      } catch (e) {
        return { success: false };
      }
      return { success: true };
    },
  }),
}));
