import { toTitleCase } from "@/application/util/utils.js";
import {
  cleanString,
  toStringList,
} from "@/application/validations/Formatters.js";
import { readCSV } from "@/infrastructure/file_io/read.js";
import { db } from "@/infrastructure/repository/db.js";
import { MeasurementSystem, UnitType } from "@prisma/client";
import { z } from "zod";

const unitValidationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().transform(toTitleCase),
  lookupNames: z.preprocess(toStringList, z.string().array().nullish()),
  symbol: z.preprocess(cleanString, z.string().nullish()),
  conversionName: z.preprocess(cleanString, z.string().nullish()),
  type: z.preprocess((val) => {
    return String(val).toUpperCase();
  }, z.nativeEnum(UnitType)),
  system: z.preprocess((val) => {
    if (!val) return undefined;
    return String(val).toUpperCase();
  }, z.nativeEnum(MeasurementSystem).nullish()),
});

export async function loadUnits() {
  const units = await readCSV({
    path: "/data/seed_data/units.csv",
    camelCaseHeaders: true,
    schema: unitValidationSchema,
  });

  await db.$transaction(
    units.map((unit) =>
      db.measurementUnit.upsert({
        where: { id: unit.id },
        create: {
          id: unit.id,
          name: unit.name as string,
          abbreviations: unit.lookupNames ? unit.lookupNames : undefined,
          symbol: unit.symbol,
          conversionName: unit.conversionName,
          type: unit.type,
          system: unit.system,
        },
        update: {
          id: unit.id,
          name: unit.name as string,
          abbreviations: unit.lookupNames ? unit.lookupNames : undefined,
          symbol: unit.symbol,
          conversionName: unit.conversionName,
          type: unit.type,
          system: unit.system,
        },
      })
    )
  );
}
