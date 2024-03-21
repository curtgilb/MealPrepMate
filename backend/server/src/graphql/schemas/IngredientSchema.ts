import { builder } from "../builder.js";
import {
  ExpirationRule,
  Ingredient,
  Prisma,
  RecipeIngredient,
} from "@prisma/client";
import { db } from "../../db.js";
import { recipeIngredient } from "./RecipeSchema.js";
import { queryFromInfo } from "@pothos/plugin-prisma";
import { z } from "zod";
import { nextPageInfo, offsetPagination } from "./UtilitySchema.js";
import { offsetPaginationValidation } from "../../validations/graphql/UtilityValidation.js";
import {
  createExpirationRuleValidation,
  createIngredientValidation,
  createPriceHistoryValidation,
  editPriceHistoryValidation,
} from "../../validations/graphql/IngredientValidation.js";

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

const rulesQuery = builder
  .objectRef<{
    nextOffset: number | null;
    itemsRemaining: number;
    rules: ExpirationRule[];
  }>("ExpirationRulesQuery")
  .implement({
    fields: (t) => ({
      nextOffset: t.exposeInt("nextOffset", { nullable: true }),
      itemsRemaining: t.exposeInt("itemsRemaining"),
      ingredients: t.field({
        type: [expRule],
        resolve: (result) => result.rules,
      }),
    }),
  });

const ingredient = builder.prismaObject("Ingredient", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    alternateNames: t.exposeStringList("alternateNames"),
    storageInstructions: t.exposeString("storageInstructions", {
      nullable: true,
    }),
    priceHistory: t.relation("priceHistory"),
    expiration: t.relation("expirationRule"),
  }),
});

builder.prismaObject("IngredientPrice", {
  fields: (t) => ({
    retailer: t.exposeString("retailer"),
    price: t.exposeFloat("price"),
    quantity: t.exposeFloat("quantity"),
    unit: t.relation("unit"),
    pricePerUnit: t.exposeFloat("pricePerUnit"),
  }),
});

const expRule = builder.prismaObject("ExpirationRule", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    variation: t.exposeString("variant", { nullable: true }),
    defrostTime: t.exposeInt("defrostTime", { nullable: true }),
    perishable: t.exposeBoolean("perishable", { nullable: true }),
    tableLife: t.exposeInt("tableLife", { nullable: true }),
    fridgeLife: t.exposeInt("fridgeLife", { nullable: true }),
    freezerLife: t.exposeInt("freezerLife", { nullable: true }),
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

const createPriceHistory = builder.inputType("CreatePriceHistoryInput", {
  fields: (t) => ({
    ingredientId: t.string({ required: true }),
    date: t.field({ type: "DateTime", required: true }),
    retailer: t.string({ required: true }),
    price: t.float({ required: true }),
    quantity: t.float({ required: true }),
    unitId: t.string({ required: true }),
    pricePerUnit: t.float({ required: true }),
  }),
});

const editPriceHistory = builder.inputType("EditPriceHistoryInput", {
  fields: (t) => ({
    date: t.field({ type: "DateTime" }),
    retailer: t.string(),
    price: t.float(),
    quantity: t.float(),
    unitId: t.string(),
    pricePerUnit: t.float(),
  }),
});

const createExpirationRule = builder.inputType("CreateExpirationRule", {
  fields: (t) => ({
    name: t.string({ required: true }),
    variation: t.string(),
    defrostTime: t.float(),
    perishable: t.boolean(),
    tableLife: t.int({ required: true }),
    fridgeLife: t.int({ required: true }),
    freezerLife: t.int({ required: true }),
    ingredientId: t.id(),
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
        args.pagination.offset,
        count
      );
      return { itemsRemaining, nextOffset, ingredients: data };
    },
  }),
  ingredientPrice: t.prismaField({
    type: "IngredientPrice",
    args: {
      ingredientPriceId: t.arg.string({ required: true }),
    },
    validate: {
      schema: z.object({ ingredientPriceId: z.string().cuid() }),
    },
    resolve: async (query, root, args) => {
      return await db.ingredientPrice.findUniqueOrThrow({
        where: { id: args.ingredientPriceId },
        ...query,
      });
    },
  }),
  priceHistory: t.prismaField({
    type: ["IngredientPrice"],
    args: {
      ingredientId: t.arg.string({ required: true }),
      retailer: t.arg.string(),
    },
    validate: {
      schema: z.object({
        ingredientId: z.string().cuid(),
        retailer: z.string().optional(),
      }),
    },
    resolve: async (query, root, args) => {
      return await db.ingredientPrice.findMany({
        where: args.retailer
          ? { ingredientId: args.ingredientId, retailer: args.retailer }
          : { ingredientId: args.ingredientId },
        orderBy: {
          date: "asc",
        },
        ...query,
      });
    },
  }),
  expirationRule: t.prismaField({
    type: "ExpirationRule",
    args: {
      expirationRuleId: t.arg.string({ required: true }),
    },
    validate: {
      schema: z.object({ expirationRuleId: z.string().cuid() }),
    },
    resolve: async (query, root, args) => {
      return await db.expirationRule.findUniqueOrThrow({
        where: { id: args.expirationRuleId },
        ...query,
      });
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
    resolve: async (root, args, context, info) => {
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
  expirationRules: t.field({
    type: rulesQuery,
    args: {
      search: t.arg.string(),
      pagination: t.arg({ type: offsetPagination, required: true }),
    },
    validate: {
      schema: z.object({
        search: z.string().optional(),
        pagination: offsetPaginationValidation,
      }),
    },
    resolve: async (root, args, context, info) => {
      const where: Prisma.ExpirationRuleWhereInput = args.search
        ? {
            name: { contains: args.search, mode: "insensitive" },
          }
        : {};
      const [data, count] = await db.$transaction([
        db.expirationRule.findMany({
          where,
          take: args.pagination.take,
          skip: args.pagination.offset,
          orderBy: { name: "asc" },
          ...queryFromInfo({ context, info, path: ["ingredients"] }),
        }),
        db.expirationRule.count({ where }),
      ]);
      const { itemsRemaining, nextOffset } = nextPageInfo(
        data.length,
        args.pagination.offset,
        count
      );
      return { itemsRemaining, nextOffset, rules: data };
    },
  }),
}));

// ============================================ Mutations ===================================

builder.mutationFields((t) => ({
  addPriceHistory: t.prismaField({
    type: "IngredientPrice",
    args: {
      price: t.arg({ type: createPriceHistory, required: true }),
    },
    validate: {
      schema: z.object({ price: createPriceHistoryValidation }),
    },
    resolve: async (query, root, args) => {
      return await db.ingredientPrice.create({
        data: {
          date: args.price.date,
          retailer: args.price.retailer,
          price: args.price.price,
          quantity: args.price.quantity,
          unit: {
            connect: {
              id: args.price.unitId,
            },
          },
          pricePerUnit: args.price.pricePerUnit,
          ingredient: {
            connect: {
              id: args.price.ingredientId,
            },
          },
        },
        ...query,
      });
    },
  }),
  editPriceHistory: t.prismaField({
    type: "IngredientPrice",
    args: {
      priceId: t.arg.string({ required: true }),
      price: t.arg({ type: editPriceHistory, required: true }),
    },
    validate: {
      schema: z.object({
        priceId: z.string().cuid(),
        price: editPriceHistoryValidation,
      }),
    },
    resolve: async (query, root, args) => {
      return await db.ingredientPrice.update({
        where: {
          id: args.priceId,
        },
        data: {
          date: args.price.date ? args.price.date : undefined,
          retailer: args.price.retailer ? args.price.retailer : undefined,
          price: args.price.price ? args.price.price : undefined,
          quantity: args.price.quantity ? args.price.quantity : undefined,
          unitId: args.price.unitId ? args.price.unitId : undefined,
          pricePerUnit: args.price.pricePerUnit
            ? args.price.pricePerUnit
            : undefined,
        },
        ...query,
      });
    },
  }),
  deletePriceHistory: t.prismaField({
    type: ["IngredientPrice"],
    args: {
      ingredientId: t.arg.string({ required: true }),
      ingredientPriceId: t.arg.string({ required: true }),
    },
    validate: {
      schema: z.object({
        ingredientId: z.string().cuid(),
        ingredientPriceId: z.string().cuid(),
      }),
    },
    resolve: async (query, root, args) => {
      await db.ingredientPrice.deleteMany({
        where: {
          id: args.ingredientPriceId,
        },
      });
      return await db.ingredientPrice.findMany({
        where: { ingredientId: args.ingredientId },
        ...query,
      });
    },
  }),
  createExpirationRule: t.prismaField({
    type: "ExpirationRule",
    args: {
      ingredientId: t.arg.string({ required: true }),
      rule: t.arg({ type: createExpirationRule, required: true }),
    },
    validate: {
      schema: z.object({
        ingredientId: z.string().cuid(),
        rule: createExpirationRuleValidation,
      }),
    },
    resolve: async (query, root, args) => {
      return await db.expirationRule.create({
        data: {
          name: args.rule.name,
          variant: args.rule.variation,
          defrostTime: args.rule.defrostTime,
          perishable: args.rule.perishable,
          tableLife: args.rule.tableLife,
          fridgeLife: args.rule.fridgeLife,
          freezerLife: args.rule.freezerLife,
          ingredients: args.ingredientId
            ? {
                connect: {
                  id: args.ingredientId,
                },
              }
            : undefined,
        },
        ...query,
      });
    },
  }),
  connectExpirationRule: t.prismaField({
    type: "Ingredient",
    args: {
      ingredientId: t.arg.string({ required: true }),
      expirationRuleId: t.arg.string({ required: true }),
    },
    validate: {
      schema: z.object({
        ingredientId: z.string().cuid(),
        expirationRuleId: z.string().cuid(),
      }),
    },
    resolve: async (query, root, args) => {
      return await db.ingredient.update({
        where: {
          id: args.ingredientId,
        },
        data: {
          expirationRule: {
            connect: {
              id: args.expirationRuleId,
            },
          },
        },
        ...query,
      });
    },
  }),
  editExpirationRule: t.prismaField({
    type: "ExpirationRule",
    args: {
      expirationRuleId: t.arg.string({ required: true }),
      expirationRule: t.arg({ type: createExpirationRule, required: true }),
    },
    validate: {
      schema: z.object({
        expirationRuleId: z.string().cuid(),
        expirationRule: createExpirationRuleValidation,
      }),
    },
    resolve: async (query, root, args) => {
      return await db.expirationRule.update({
        where: {
          id: args.expirationRuleId,
        },
        data: {
          defrostTime: args.expirationRule.defrostTime,
          perishable: args.expirationRule.perishable,
          tableLife: args.expirationRule.tableLife,
          fridgeLife: args.expirationRule.fridgeLife,
          freezerLife: args.expirationRule.freezerLife,
        },
      });
    },
  }),
  deleteExpirationRule: t.prismaField({
    type: ["ExpirationRule"],
    args: {
      expirationRuleId: t.arg.string({ required: true }),
    },
    validate: {
      schema: z.object({ expirationRuleId: z.string().cuid() }),
    },
    resolve: async (query, root, args) => {
      await db.expirationRule.delete({
        where: {
          id: args.expirationRuleId,
        },
      });
      return await db.expirationRule.findMany({ ...query });
    },
  }),
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
