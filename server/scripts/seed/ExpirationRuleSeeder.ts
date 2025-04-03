import { toTitleCase } from "@/application/util/utils.js";
import { cleanString } from "@/application/validations/Formatters.js";
import { readCSV } from "@/infrastructure/file_io/read.js";
import { db } from "@/infrastructure/repository/db.js";
import { z } from "zod";

const expirationRuleSchema = z.object({
  id: z.string().uuid(),
  name: z.preprocess(cleanString, z.string()).transform(toTitleCase),
  variant: z
    .preprocess(cleanString, z.string().nullish())
    .transform(toTitleCase),
  tableDays: z.coerce.number().int().nullish(),
  fridgeDays: z.coerce.number().int().nullish(),
  freezerDays: z.coerce.number().int().nullish(),
  defrostTime: z.coerce.number().nullish(),
});

export async function loadExpirationRules() {
  const rules = await readCSV({
    path: "/data/seed_data/ExpirationRules.csv",
    schema: expirationRuleSchema,
    camelCaseHeaders: true,
  });

  await db.$transaction(async (tx) => {
    for (const rule of rules) {
      await tx.expirationRule.upsert({
        where: { id: rule.id },
        create: {
          id: rule.id,
          name: rule.name as string,
          variant: rule.variant,
          tableLife: rule.tableDays,
          fridgeLife: rule.fridgeDays,
          freezerLife: rule.freezerDays,
          defrostTime: rule.defrostTime,
        },
        update: {
          id: rule.id,
          name: rule.name as string,
          variant: rule.variant,
          tableLife: rule.tableDays,
          fridgeLife: rule.fridgeDays,
          freezerLife: rule.freezerDays,
          defrostTime: rule.defrostTime,
        },
      });
    }
  });
}
