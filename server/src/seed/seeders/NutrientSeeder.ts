import { toTitleCase } from "@/application/util/utils.js";
import {
  cleanString,
  toStringList,
} from "@/application/validations/Formatters.js";
import { readCSV } from "@/infrastructure/file_io/read.js";
import { db } from "@/infrastructure/repository/db.js";
import { NutrientType } from "@prisma/client";
import { z } from "zod";

const nutrientSchema = z.object({
  id: z.string().uuid(),
  nutrient: z.preprocess(cleanString, z.string()).transform(toTitleCase),
  isMacro: z.coerce.boolean(),
  unit: z.preprocess(cleanString, z.string()),
  advancedView: z.coerce.boolean(),
  important: z.coerce.boolean(),
  order: z.coerce.number().int().positive(),
  notes: z.preprocess(cleanString, z.string().optional()),
  alternateNames: z.preprocess(toStringList, z.string().array().optional()),
  type: z.preprocess((val) => {
    return String(val).toUpperCase();
  }, z.nativeEnum(NutrientType)),
  parentNutrient: z.preprocess(cleanString, z.string().optional()),
});

export async function loadNutrients() {
  const data = await readCSV({
    path: "/data/seed_data/nutrients.csv",
    schema: nutrientSchema,
    camelCaseHeaders: true,
  });

  await db.$transaction(async (tx) => {
    const nameToIdMapping: { [key: string]: string } = {};
    for (const record of data) {
      const unit = await tx.measurementUnit.match(record.unit);
      if (!unit) throw Error("Could not find unit to match nutrient");

      const nutrient = await tx.nutrient.upsert({
        where: { id: record.id },
        create: {
          id: record.id,
          name: record.nutrient as string,
          isMacro: record.isMacro,
          alternateNames: record.alternateNames,
          type: record.type,
          important: record.important,
          advancedView: record.advancedView,
          unit: { connect: { id: unit.id } },
          order: record.order,
        },
        update: {
          id: record.id,
          name: record.nutrient as string,
          isMacro: record.isMacro,
          alternateNames: record.alternateNames,
          type: record.type,
          important: record.important,
          advancedView: record.advancedView,
          unit: { connect: { id: unit.id } },
          order: record.order,
        },
      });
      if (record?.parentNutrient) {
        nameToIdMapping[nutrient.name] = record.parentNutrient;
      }
    }

    // Link with parents
    const updatePromises = Object.entries(nameToIdMapping).map(
      async ([name, parentName]) => {
        await tx.nutrient.update({
          where: { name: name },
          data: { parentNutrient: { connect: { name: parentName } } },
        });
      }
    );

    await Promise.allSettled(updatePromises);
  });
}
