import { toTitleCase } from "@/application/util/utils.js";
import {
  cleanString,
  toStringList,
} from "@/application/validations/Formatters.js";
import { readCSV } from "@/infrastructure/file_io/read.js";
import { db } from "@/infrastructure/repository/db.js";
import { z } from "zod";

const unitSchema = z.object({
  id: z.string().uuid(),
  name: z.preprocess(cleanString, z.string()).transform(toTitleCase),
});

export async function loadGroceryStores() {
  const data = await readCSV({
    path: "/data/seed_data/GroceryStores.csv",
    camelCaseHeaders: true,
    schema: unitSchema,
  });

  for (const record of data) {
    await db.groceryStore.upsert({
      where: { id: record.id },
      update: {
        id: record.id,
        name: record.name,
      },
      create: {
        id: record.id,
        name: record.name as string,
      },
    });
  }
}
