import { raw } from "@prisma/client/runtime/library.js";
import { readCSV } from "../io/Readers.js";
import { CronometerNutrition } from "../../types/CustomTypes.js";
import { db } from "../../db.js";
import { cast } from "../../util/Cast.js";

export class CronometerParser {
  async parse(
    source: string,
    filePath = false
  ): Promise<CronometerNutrition[]> {
    const csvData = await readCSV(source, filePath);
    const mappings = await this.getNutrientCronometerMapping();
    const labels: CronometerNutrition[] = csvData.map((row) => {
      const { day, time, group, foodName, amount, category, ...rest } =
        row.record;
      const parsedAmount = this.parseAmount(amount);

      return {
        day: new Date(day),
        time: time,
        group: group,
        foodName: foodName,
        amount: parsedAmount?.[0],
        unit: parsedAmount?.[1],
        category: category,
        nutrients: Object.entries(rest).map(([name, value]) => {
          const nutrientName = mappings.get(name);
          if (!nutrientName) throw Error(`No mapping for ${name}`);
          return { id: nutrientName.id, amount: cast(value) as number };
        }),
        rawInput: row.raw,
      };
    });
    return labels;
  }

  parseAmount(input: string): [number, string] | null {
    const regex = /(\d+(\.\d+)?)(.*)/;
    const match = input.match(regex);
    return match ? [parseFloat(match[1]), match[3].trim()] : null;
  }

  async getNutrientCronometerMapping(): Promise<
    Map<string, { id: string; name: string }>
  > {
    const result = await db.nutrient.findMany({
      where: { cronometerMapping: { not: null } },
    });

    return result.reduce((aggregation, nutrient) => {
      aggregation.set(nutrient.cronometerMapping as string, {
        id: nutrient.id,
        name: nutrient.name,
      });
      return aggregation;
    }, new Map<string, { id: string; name: string }>());
  }
}
