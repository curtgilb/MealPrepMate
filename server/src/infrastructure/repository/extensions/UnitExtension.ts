import { db } from "@/infrastructure/repository/db.js";
import { MeasurementUnit, Prisma } from "@prisma/client";
import { searchUnits } from "@prisma/client/sql";

export const unitExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    model: {
      measurementUnit: {
        async match(search: string): Promise<MeasurementUnit | null> {
          // Check previous matches that have been verified
          const searchResult = await db.$queryRawTyped(searchUnits(search, 1));
          return searchResult.length > 0
            ? (searchResult[0] as MeasurementUnit)
            : null;
        },
      },
    },
  });
});
