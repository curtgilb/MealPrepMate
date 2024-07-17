import { queryFromInfo } from "@pothos/plugin-prisma";
import { Ingredient, Prisma, RecipeIngredient } from "@prisma/client";
import { z } from "zod";
import { db } from "../../db.js";
import { createIngredientValidation } from "../../validations/IngredientValidation.js";
import { offsetPaginationValidation } from "../../validations/UtilityValidation.js";
import { builder } from "../builder.js";
import { recipeIngredient } from "./RecipeIngredientSchema.js";
import { nextPageInfo, offsetPagination } from "./UtilitySchema.js";

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
  }),
});

// ============================================ Queries ===================================

builder.queryFields((t) => ({
  ingredient: t.prismaField({
    type: "Ingredient",
    args: {
      ingredientId: t.arg.string({ required: true }),
    },
    validate: {
      schema: z.object({ ingredientId: z.string().cuid() }),
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
    validate: {
      schema: z.object({
        search: z.string().optional(),
        pagination: offsetPaginationValidation,
      }),
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
    validate: {
      schema: z.object({ recipeIds: z.string().cuid().array() }),
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
    validate: { schema: z.object({ ingredient: createIngredientValidation }) },
    resolve: async (query, root, args) => {
      const ingredientInput: Prisma.IngredientCreateInput = {
        name: args.ingredient.name,
        storageInstructions: args.ingredient.storageInstructions,
      };
      if (args.ingredient.alternateNames)
        ingredientInput.alternateNames = args.ingredient.alternateNames;
      return await db.ingredient.create({
        data: ingredientInput,
        ...query,
      });
    },
  }),
  editIngredient: t.prismaField({
    type: "Ingredient",
    args: {
      ingredientId: t.arg.string({ required: true }),
      ingredient: t.arg({ type: createIngredientInput, required: true }),
    },
    validate: {
      schema: z.object({
        ingredientId: z.string().cuid(),
        ingredient: createIngredientValidation,
      }),
    },
    resolve: async (query, root, args) => {
      return db.ingredient.update({
        where: { id: args.ingredientId },
        data: {
          name: args.ingredient.name,
          storageInstructions: args.ingredient.storageInstructions,
        },
      });
    },
  }),
  mergeIngredients: t.prismaField({
    type: "Ingredient",
    args: {
      ingredientIdToKeep: t.arg.string({ required: true }),
      ingredientIdToDelete: t.arg.string({ required: true }),
    },
    validate: {
      schema: z.object({
        ingredientIdToKeep: z.string().cuid(),
        ingredientIdToDelete: z.string().cuid(),
      }),
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
  deleteIngredient: t.prismaField({
    type: ["Ingredient"],
    args: {
      ingredientToDeleteId: t.arg.string({ required: true }),
    },
    validate: { schema: z.object({ ingredientToDeleteId: z.string().cuid() }) },
    resolve: async (query, root, args) => {
      await db.ingredient.delete({
        where: { id: args.ingredientToDeleteId },
      });
      return await db.ingredient.findMany({ ...query });
    },
  }),
}));
