import { db } from '@/infrastructure/repository/db.js';
import { builder } from '@/presentation/builder.js';
import { DeleteResult } from '@/presentation/schemas/common/MutationResult.js';
import { encodeGlobalID } from '@pothos/plugin-relay';

// ============================================ Types ===================================
builder.prismaNode("RecipeIngredientGroup", {
  id: { field: "id" },
  fields: (t) => ({
    name: t.exposeString("name"),
    recipe: t.relation("recipe"),
    ingredients: t.relation("ingredients"),
    label: t.relation("nutritionLabel", { nullable: true }),
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
      recipeId: t.arg.globalID({ required: true }),
      name: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args) => {
      console.log(args);
      return await db.recipeIngredientGroup.create({
        data: {
          recipe: { connect: { id: args.recipeId.id } },
          name: args.name,
        },
        ...query,
      });
    },
  }),
  editRecipeIngredientGroup: t.prismaField({
    type: "RecipeIngredientGroup",
    args: {
      groupId: t.arg.globalID({ required: true }),
      name: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args) => {
      return await db.recipeIngredientGroup.update({
        where: { id: args.groupId.id },
        data: { name: args.name },
        ...query,
      });
    },
  }),
  deleteRecipeIngredientGroup: t.field({
    type: DeleteResult,
    args: {
      groupId: t.arg.globalID({ required: true }),
    },
    resolve: async (root, args) => {
      await db.recipeIngredientGroup.delete({ where: { id: args.groupId.id } });
      return {
        success: true,
        id: encodeGlobalID(args.groupId.typename, args.groupId.id),
      };
    },
  }),
}));
