import { Prisma } from "@prisma/client";
import { db } from "../../db.js";

class Parser {
  async getNutrientMapping(
    where: Prisma.NutrientWhereInput
  ): Promise<Map<string, string>> {
    const result = await db.nutrient.findMany({
      where: where,
    });

    return result.reduce((aggregation, nutrient) => {
      aggregation.set(nutrient.cronometerMapping as string, nutrient.id);
      return aggregation;
    }, new Map<string, string>());
  }
}
