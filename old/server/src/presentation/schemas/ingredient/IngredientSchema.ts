import {
  createIngredient,
  deleteIngredient,
  editIngredient,
  getIngredient,
  getIngredients,
  IngredientInput,
} from "@/application/services/ingredient/IngredientService.js";
import { builder } from "@/presentation/builder.js";
import { DeleteResult } from "@/presentation/schemas/common/MutationResult.js";
import { recipeIngredient } from "@/presentation/schemas/recipe/RecipeIngredientSchema.js";
import { encodeGlobalID } from "@pothos/plugin-relay";
import { RecipeIngredient } from "@prisma/client";

// ============================================ Types ===================================

type GroupedRecipeIngredient = {
  ingredientId: string | null;
  ingredientName: string | null;
  recipeIngredients: RecipeIngredient[];
};
const groupedIngredients = builder
  .objectRef<GroupedRecipeIngredient>("GroupedRecipeIngredient")
  .implement({
    fields: (t) => ({
      ingredientId: t.exposeString("ingredientId", { nullable: true }),
      ingredientName: t.exposeString("ingredientName", { nullable: true }),
      recipeIngredients: t.field({
        type: [recipeIngredient],
        resolve: (result) => result.recipeIngredients,
      }),
    }),
  });

export const ingredient = builder.prismaNode("Ingredient", {
  id: { field: "id" },
  fields: (t) => ({
    name: t.exposeString("name"),
    alternateNames: t.exposeStringList("alternateNames"),
    category: t.relation("category", { nullable: true }),
    storageInstructions: t.exposeString("storageInstructions", {
      nullable: true,
    }),
    priceHistory: t.relation("priceHistory", { nullable: true }),
    expiration: t.relation("expirationRule", { nullable: true }),
  }),
});

// ============================================ Inputs ===================================
const ingredientInput = builder
  .inputRef<IngredientInput>("IngredientInput")
  .implement({
    fields: (t) => ({
      name: t.string({ required: true }),
      alternateNames: t.stringList(),
      storageInstructions: t.string(),
      categoryId: t.field({ type: "RefID" }),
      expirationRuleId: t.field({ type: "RefID" }),
    }),
  });

// ============================================ Queries ===================================

builder.queryFields((t) => ({
  ingredient: t.prismaField({
    type: "Ingredient",
    args: {
      ingredientId: t.arg.globalID({ required: true }),
    },
    resolve: async (query, root, args) => {
      return await getIngredient(args.ingredientId.id, query);
    },
  }),
  ingredients: t.prismaConnection({
    type: "Ingredient",
    cursor: "id",
    edgesNullable: false,
    nodeNullable: false,
    args: {
      search: t.arg.string(),
    },
    resolve: async (query, root, args) => {
      return await getIngredients(args.search ?? undefined, query);
    },
  }),
  // groupedRecipeIngredients: t.field({
  //   type: [groupedIngredients],
  //   args: {
  //     recipeIds: t.arg.stringList({ required: true }),
  //   },
  //   resolve: async (root, args) => {
  //     const ingredients = await db.recipeIngredient.findMany({
  //       where: { recipeId: { in: args.recipeIds } },
  //       include: {
  //         recipe: true,
  //         ingredient: true,
  //       },
  //     });

  //     const grouped = ingredients.reduce((acc, cur) => {
  //       const key = cur.ingredientId
  //         ? `${cur.ingredientId}###${cur.ingredient?.name}`
  //         : "";
  //       if (!acc.has(key)) {
  //         acc.set(key, []);
  //       }
  //       acc.get(key)?.push(cur);
  //       return acc;
  //     }, new Map<string, RecipeIngredient[]>());

  //     const results: GroupedRecipeIngredient[] = [];
  //     for (const [key, value] of grouped.entries()) {
  //       const splitKey = key.split("###");
  //       const ingredientId = splitKey.length > 0 ? splitKey[0] : null;
  //       const ingredientName = splitKey.length > 0 ? splitKey[1] : null;
  //       results.push({
  //         ingredientId,
  //         ingredientName,
  //         recipeIngredients: value,
  //       });
  //     }
  //     return results;
  //   },
  // }),
}));

// ============================================ Mutations ===================================

builder.mutationFields((t) => ({
  createIngredient: t.prismaField({
    type: "Ingredient",
    args: {
      ingredient: t.arg({ type: ingredientInput, required: true }),
    },
    resolve: async (query, root, args) => {
      console.log(args.ingredient);
      return await createIngredient(args.ingredient, query);
    },
  }),
  editIngredient: t.prismaField({
    type: "Ingredient",
    args: {
      id: t.arg.globalID({ required: true }),
      ingredient: t.arg({ type: ingredientInput, required: true }),
    },
    resolve: async (query, root, args) => {
      console.log(args.ingredient);
      return await editIngredient(args.id.id, args.ingredient, query);
    },
  }),
  deleteIngredient: t.field({
    type: DeleteResult,
    args: {
      ingredientId: t.arg.globalID({ required: true }),
    },
    resolve: async (root, args) => {
      await deleteIngredient(args.ingredientId.id);
      return {
        success: true,
        id: encodeGlobalID(args.ingredientId.typename, args.ingredientId.id),
      };
    },
  }),
}));
