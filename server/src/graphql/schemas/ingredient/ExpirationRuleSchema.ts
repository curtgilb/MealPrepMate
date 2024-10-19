import { builder } from "@/graphql/builder.js";
import { db } from "@/infrastructure/repository/db.js";
import { DeleteResult } from "@/graphql/schemas/common/MutationResult.js";

builder.prismaNode("ExpirationRule", {
  id: { field: "id" },
  fields: (t) => ({
    name: t.exposeString("name"),
    variation: t.exposeString("variant", { nullable: true }),
    defrostTime: t.exposeInt("defrostTime", { nullable: true }),
    perishable: t.exposeBoolean("perishable", { nullable: true }),
    tableLife: t.exposeInt("tableLife", { nullable: true }),
    fridgeLife: t.exposeInt("fridgeLife", { nullable: true }),
    freezerLife: t.exposeInt("freezerLife", { nullable: true }),
    longestLife: t.int({
      nullable: true,
      resolve: (rule) => {
        const lifes = [
          rule.tableLife,
          rule.fridgeLife,
          rule.freezerLife,
        ].filter((lifespan) => lifespan) as number[];
        return Math.max(...lifes);
      },
    }),
  }),
});

// ============================================ Inputs ==================================

const createExpirationRule = builder.inputType("CreateExpirationRuleInput", {
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

const editExpirationRule = builder.inputType("EditExpirationRuleInput", {
  fields: (t) => ({
    id: t.string({ required: true }),
    name: t.string(),
    variation: t.string(),
    defrostTime: t.float(),
    perishable: t.boolean(),
    tableLife: t.int(),
    fridgeLife: t.int(),
    freezerLife: t.int(),
    ingredientId: t.id(),
  }),
});

// ============================================ Queries =================================
builder.queryFields((t) => ({
  expirationRule: t.prismaField({
    type: "ExpirationRule",
    args: {
      expirationRuleId: t.arg.id({ required: true }),
    },
    resolve: async (query, root, args) => {
      //@ts-ignore
      return await db.expirationRule.findUniqueOrThrow({
        where: { id: args.expirationRuleId },
        ...query,
      });
    },
  }),
  expirationRules: t.prismaConnection({
    type: "ExpirationRule",
    cursor: "id",
    args: {
      search: t.arg.string(),
    },
    resolve: async (query) => {
      //@ts-ignore
      return await db.expirationRule.findMany({ ...query });
    },
  }),
}));

// ============================================ Mutations =================================
builder.mutationFields((t) => ({
  createExpirationRule: t.prismaField({
    type: "ExpirationRule",
    args: {
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
      expirationRule: t.arg({ type: editExpirationRule, required: true }),
    },
    resolve: async (query, root, args) => {
      return await db.expirationRule.update({
        where: {
          id: args.expirationRule.id,
        },
        data: {
          defrostTime: args.expirationRule.defrostTime,
          perishable: args.expirationRule.perishable,
          tableLife: args.expirationRule.tableLife,
          fridgeLife: args.expirationRule.fridgeLife,
          freezerLife: args.expirationRule.freezerLife,
        },
        ...query,
      });
    },
  }),
  deleteExpirationRule: t.field({
    type: DeleteResult,
    args: {
      expirationRuleId: t.arg.string({ required: true }),
    },
    resolve: async (root, args) => {
      try {
        await db.expirationRule.delete({
          where: {
            id: args.expirationRuleId,
          },
        });
      } catch (e) {
        return { success: false, message: e instanceof Error ? e.message : "" };
      }
      return { success: true };
    },
  }),
}));
