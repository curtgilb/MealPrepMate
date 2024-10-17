import { offsetPaginationValidation } from "@/application/validations/UtilityValidation.js";
import { builder } from "@/graphql/builder.js";
import { DeleteResult } from "@/graphql/schemas/common/MutationResult.js";
import {
  nextPageInfo,
  offsetPagination,
} from "@/graphql/schemas/common/Pagination.js";
import { recipeIngredient } from "@/graphql/schemas/recipe/RecipeIngredientSchema.js";
import { db } from "@/infrastructure/repository/db.js";
import { queryFromInfo } from "@pothos/plugin-prisma";
import { Ingredient, Prisma, RecipeIngredient } from "@prisma/client";
import { z } from "zod";

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

const ingredientsQuery = builder
  .objectRef<{
    nextOffset: number | null;
    itemsRemaining: number;
    ingredients: Ingredient[];
  }>("IngredientsQuery")
  .implement({
    fields: (t) => ({
      nextOffset: t.exposeInt("nextOffset", { nullable: true }),
      itemsRemaining: t.exposeInt("itemsRemaining"),
      ingredients: t.field({
        type: [ingredient],
        resolve: (result) => result.ingredients,
      }),
    }),
  });

export const ingredient = builder.prismaObject("Ingredient", {
  fields: (t) => ({
    id: t.exposeID("id"),
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
const createIngredientInput = builder.inputType("CreateIngredientInput", {
  fields: (t) => ({
    name: t.string({ required: true }),
    alternateNames: t.stringList(),
    storageInstructions: t.string(),
    categoryId: t.string({ required: true }),
    expirationRuleId: t.string(),
  }),
});

const editIngredientInput = builder.inputType("EditIngredientInput", {
  fields: (t) => ({
    ingredientId: t.string({ required: true }),
    name: t.string(),
    alternateNames: t.stringList(),
    storageInstructions: t.string(),
    categoryId: t.string(),
    expirationRuleId: t.string(),
  }),
});

// ============================================ Queries ===================================

builder.queryFields((t) => ({
  ingredient: t.prismaField({
    type: "Ingredient",
    args: {
      ingredientId: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args) => {
      return await db.ingredient.findUniqueOrThrow({
        where: { id: args.ingredientId },
        ...query,
      });
    },
  }),
  ingredients: t.field({
    type: ingredientsQuery,
    args: {
      pagination: t.arg({
        type: offsetPagination,
        required: true,
      }),
      search: t.arg.string(),
    },
    resolve: async (root, args, context, info) => {
      const where: Prisma.IngredientWhereInput = args.search
        ? {
            OR: [
              { name: { contains: args.search, mode: "insensitive" } },
              { alternateNames: { has: args.search } },
            ],
          }
        : {};
      const [data, count] = await db.$transaction([
        db.ingredient.findMany({
          where,
          take: args.pagination.take,
          skip: args.pagination.offset,
          orderBy: { name: "asc" },
          ...queryFromInfo({ context, info, path: ["ingredients"] }),
        }),
        db.ingredient.count({ where }),
      ]);
      const { itemsRemaining, nextOffset } = nextPageInfo(
        data.length,
        args.pagination.take,
        args.pagination.offset,
        count
      );
      return { itemsRemaining, nextOffset, ingredients: data };
    },
  }),

  groupedRecipeIngredients: t.field({
    type: [groupedIngredients],
    args: {
      recipeIds: t.arg.stringList({ required: true }),
    },
    resolve: async (root, args) => {
      const ingredients = await db.recipeIngredient.findMany({
        where: { recipeId: { in: args.recipeIds } },
        include: {
          recipe: true,
          ingredient: true,
        },
      });

      const grouped = ingredients.reduce((acc, cur) => {
        const key = cur.ingredientId
          ? `${cur.ingredientId}###${cur.ingredient?.name}`
          : "";
        if (!acc.has(key)) {
          acc.set(key, []);
        }
        acc.get(key)?.push(cur);
        return acc;
      }, new Map<string, RecipeIngredient[]>());

      const results: GroupedRecipeIngredient[] = [];
      for (const [key, value] of grouped.entries()) {
        const splitKey = key.split("###");
        const ingredientId = splitKey.length > 0 ? splitKey[0] : null;
        const ingredientName = splitKey.length > 0 ? splitKey[1] : null;
        results.push({
          ingredientId,
          ingredientName,
          recipeIngredients: value,
        });
      }
      return results;
    },
  }),
}));

// ============================================ Mutations ===================================

builder.mutationFields((t) => ({
  createIngredient: t.prismaField({
    type: "Ingredient",
    args: {
      ingredient: t.arg({ type: createIngredientInput, required: true }),
    },
    resolve: async (query, root, args) => {
      return await db.ingredient.create({
        data: {
          name: args.ingredient.name,
          storageInstructions: args.ingredient.storageInstructions,
          alternateNames: args.ingredient.alternateNames ?? undefined,
          category: { connect: { id: args.ingredient.categoryId } },
          expirationRule: args.ingredient.expirationRuleId
            ? { connect: { id: args.ingredient.expirationRuleId } }
            : undefined,
        },
        ...query,
      });
    },
  }),
  editIngredient: t.prismaField({
    type: "Ingredient",
    args: {
      ingredient: t.arg({ type: editIngredientInput, required: true }),
    },
    resolve: async (query, root, args) => {
      return db.ingredient.update({
        where: { id: args.ingredient.ingredientId },
        data: {
          name: args.ingredient.name ?? undefined,
          storageInstructions: args.ingredient.storageInstructions,
          alternateNames: args.ingredient.alternateNames
            ? { set: args.ingredient.alternateNames }
            : undefined,
          category: args.ingredient.categoryId
            ? { connect: { id: args.ingredient.categoryId } }
            : undefined,
          expirationRule: args.ingredient.expirationRuleId
            ? { connect: { id: args.ingredient.expirationRuleId } }
            : undefined,
        },
        ...query,
      });
    },
  }),
  mergeIngredients: t.prismaField({
    type: "Ingredient",
    args: {
      ingredientIdToKeep: t.arg.string({ required: true }),
      ingredientIdToDelete: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args) => {
      return await db.$transaction(async (tx) => {
        // Find the old record
        const old = await tx.ingredient.findUnique({
          where: { id: args.ingredientIdToDelete },
          select: {
            name: true,
            alternateNames: true,
          },
        });
        // Upsert new names on the merged record
        const names = [old?.name, old?.alternateNames].filter(
          (name) => name
        ) as string[];
        await tx.ingredient.update({
          where: { id: args.ingredientIdToKeep },
          data: { alternateNames: names },
        });
        // Delete the old record
        await tx.ingredient.delete({
          where: { id: args.ingredientIdToDelete },
        });
        return await tx.ingredient.findUniqueOrThrow({
          where: { id: args.ingredientIdToKeep },
        });
      });
    },
  }),
  deleteIngredient: t.field({
    type: DeleteResult,
    args: {
      ingredientId: t.arg.string({ required: true }),
    },
    resolve: async (root, args) => {
      try {
        await db.ingredient.delete({
          where: { id: args.ingredientId },
        });
      } catch (e) {
        return { success: false, message: e instanceof Error ? e.message : "" };
      }
      return { success: true };
    },
  }),
}));
