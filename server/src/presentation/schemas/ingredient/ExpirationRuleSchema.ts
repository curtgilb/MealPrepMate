import { builder } from "@/presentation/builder.js";
import { DeleteResult } from "@/presentation/schemas/common/MutationResult.js";
import {
  CreateExpirationRuleInput,
  EditExpirationRuleInput,
  createExpirationRule,
  deleteExpirationRule,
  editExpirationRule,
  getExpirationRule,
  getExpirationRules,
} from "@/application/services/ingredient/ExpirationRuleService.js";
import { encodeGlobalID } from "@pothos/plugin-relay";

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

const createExpirationRuleInput = builder
  .inputRef<CreateExpirationRuleInput>("CreateExpirationRuleInput")
  .implement({
    fields: (t) => ({
      name: t.string({ required: true }),
      variation: t.string(),
      defrostTime: t.float(),
      perishable: t.boolean(),
      tableLife: t.int({ required: true }),
      fridgeLife: t.int({ required: true }),
      freezerLife: t.int({ required: true }),
    }),
  });

const editExpirationRuleInput = builder
  .inputRef<EditExpirationRuleInput>("EditExpirationRuleInput")
  .implement({
    fields: (t) => ({
      name: t.string(),
      variation: t.string(),
      defrostTime: t.float(),
      perishable: t.boolean(),
      tableLife: t.int(),
      fridgeLife: t.int(),
      freezerLife: t.int(),
    }),
  });

// ============================================ Queries =================================
builder.queryFields((t) => ({
  expirationRule: t.prismaField({
    type: "ExpirationRule",
    args: {
      expirationRuleId: t.arg.globalID({ required: true }),
    },
    resolve: async (query, root, args) => {
      return await getExpirationRule(args.expirationRuleId.id, query);
    },
  }),
  expirationRules: t.prismaConnection({
    type: "ExpirationRule",
    cursor: "id",
    args: {
      search: t.arg.string(),
    },
    resolve: async (query, root, args) => {
      return await getExpirationRules(args.search ?? undefined, query);
    },
  }),
}));

// ============================================ Mutations =================================
builder.mutationFields((t) => ({
  createRule: t.prismaField({
    type: "ExpirationRule",
    args: {
      rule: t.arg({ type: createExpirationRuleInput, required: true }),
    },
    resolve: async (query, root, args) => {
      return await createExpirationRule(args.rule, query);
    },
  }),
  editExpirationRule: t.prismaField({
    type: "ExpirationRule",
    args: {
      ruleId: t.arg.globalID({ required: true }),
      expirationRule: t.arg({ type: editExpirationRuleInput, required: true }),
    },
    resolve: async (query, root, args) => {
      return editExpirationRule(
        args.ruleId.id,
        args.expirationRule as EditExpirationRuleInput,
        query
      );
    },
  }),
  deleteExpirationRule: t.field({
    type: DeleteResult,
    args: {
      expirationRuleId: t.arg.globalID({ required: true }),
    },
    resolve: async (root, args) => {
      await deleteExpirationRule(args.expirationRuleId.id);
      return {
        success: true,
        id: encodeGlobalID(
          args.expirationRuleId.typename,
          args.expirationRuleId.id
        ),
      };
    },
  }),
}));
