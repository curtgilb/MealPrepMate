import { builder } from "../builder.js";
import { Prisma } from "@prisma/client";
import { db } from "../../db.js";
// perishable: t.arg.boolean(),
// defrostTime: t.arg({ type: numericalComparison }),
// tableLife: t.arg({ type: numericalComparison }),
// fridgeLife: t.arg({ type: numericalComparison }),
// freezerLife: t.arg({ type: numericalComparison }),

// ============================================ Types ===================================

builder.prismaObject("Ingredient", {
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

builder.prismaObject("ExpirationRule", {
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
    tableLife: t.int(),
    fridgeLife: t.int(),
    freezerLife: t.int(),
    ingredientId: t.id(),
  }),
});

const paginationInput = builder.inputType("Pagination", {
  fields: (t) => ({
    start: t.int({ required: true }),
    limit: t.int({ required: true }),
  }),
});
// const ingredientsFilter = builder.inputType("IngredientFilter", {});

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
  ingredients: t.prismaField({
    type: ["Ingredient"],
    args: {
      searchString: t.arg.string(),
      start: t.arg.int(),
      limit: t.arg.int(),
    },
    resolve: async (query, root, args) => {
      const search: Prisma.IngredientFindManyArgs = { ...query };
      if (args.searchString) {
        search.where = {
          OR: [{ name: { contains: args.searchString, mode: "insensitive" } }],
        };
      }
      if (args.start && args.limit) {
        (search.skip = args.start), (search.take = args.limit);
      }
      return await db.ingredient.findMany(search);
    },
  }),
  ingredientPrice: t.prismaField({
    type: "IngredientPrice",
    args: {
      ingredientPriceId: t.arg.string({ required: true }),
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
    resolve: async (query, root, args) => {
      return await db.expirationRule.findUniqueOrThrow({
        where: { id: args.expirationRuleId },
        ...query,
      });
    },
  }),
  // expirationRules: t.prismaField({
  //   type: ["ExpirationRule"],
  //   args: {
  //     searchString: t.arg.string(),
  //     pagination: t.arg({ type: paginationInput }),
  //   },
  //   resolve: async (query, root, args) => {
  //     const search: Prisma.ExpirationRuleFindManyArgs = { ...query };
  //     return await db.expirationRule.findMany(search);
  //   },
  // }),
}));

// ============================================ Mutations ===================================

builder.mutationFields((t) => ({
  addPriceHistory: t.prismaField({
    type: "IngredientPrice",
    args: {
      price: t.arg({ type: createPriceHistory, required: true }),
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
      ingredientPriceId: t.arg.stringList({ required: true }),
    },
    resolve: async (query, root, args) => {
      await db.ingredientPrice.deleteMany({
        where: {
          id: {
            in: args.ingredientPriceId,
          },
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
      ingredientId: t.arg.string(),
      rule: t.arg({ type: createExpirationRule, required: true }),
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
    resolve: async (query, root, args) => {
      await db.expirationRule.delete({
        where: {
          id: args.expirationRuleId,
        },
      });
      return await db.expirationRule.findMany({});
    },
  }),
  createIngredient: t.prismaField({
    type: "Ingredient",
    args: {
      ingredient: t.arg({ type: createIngredientInput, required: true }),
    },
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
    resolve: async (query, root, args) => {
      await db.ingredient.delete({
        where: { id: args.ingredientToDeleteId },
      });
      return await db.ingredient.findMany({ ...query });
    },
  }),
}));
