import { db } from "@/infrastructure/repository/db.js";
import { Prisma } from "@prisma/client";

type CreateExpirationRuleInput = {
  name: string;
  variation?: string | null | undefined;
  defrostTime?: number | null | undefined;
  perishable?: boolean | null | undefined;
  tableLife: number;
  fridgeLife: number;
  freezerLife: number;
};

type EditExpirationRuleInput = {
  name?: string | undefined | null;
  variation: string | null | undefined;
  defrostTime: number | undefined | null;
  perishable?: boolean | undefined | null;
  tableLife?: number | undefined | null;
  fridgeLife?: number | undefined | null;
  freezerLife?: number | undefined | null;
};

type ExpirationRuleQuery = {
  include?: Prisma.ExpirationRuleInclude | undefined;
  select?: Prisma.ExpirationRuleSelect | undefined;
};

async function getExpirationRule(id: string, query?: ExpirationRuleQuery) {
  //@ts-ignore
  return await db.expirationRule.findUniqueOrThrow({
    //@ts-ignore
    where: { id },
    ...query,
  });
}

async function getExpirationRules(
  search?: string,
  query?: ExpirationRuleQuery
) {
  //@ts-ignore
  return await db.expirationRule.findMany({
    where: {
      name: { contains: search ?? undefined, mode: "insensitive" },
    },
    ...query,
  });
}

async function createExpirationRule(
  rule: CreateExpirationRuleInput,
  query?: ExpirationRuleQuery
) {
  //@ts-ignore
  return await db.expirationRule.create({
    //@ts-ignore
    data: {
      name: rule.name,
      variant: rule.variation,
      defrostTime: rule.defrostTime,
      perishable: rule.perishable,
      tableLife: rule.tableLife,
      fridgeLife: rule.fridgeLife,
      freezerLife: rule.freezerLife,
    },
    ...query,
  });
}

async function editExpirationRule(
  ruleId: string,
  rule: EditExpirationRuleInput,
  query?: ExpirationRuleQuery
) {
  return await db.expirationRule.update({
    where: {
      id: ruleId,
    },
    data: {
      defrostTime: rule.defrostTime,
      perishable: rule.perishable,
      tableLife: rule.tableLife,
      fridgeLife: rule.fridgeLife,
      freezerLife: rule.freezerLife,
    },
    ...query,
  });
}

async function deleteExpirationRule(ruleId: string) {
  await db.expirationRule.delete({
    where: {
      id: ruleId,
    },
  });
}

export {
  CreateExpirationRuleInput,
  EditExpirationRuleInput,
  createExpirationRule,
  editExpirationRule,
  deleteExpirationRule,
  getExpirationRule,
  getExpirationRules,
};
