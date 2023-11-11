import { readCSV } from "../io/Readers.js";
import { MyFitnessPalNutrition } from "../../types/CustomTypes.js";
import { db } from "../../db.js";
import { cast } from "../../util/Cast.js";

export class CronometerParser {
  async parse(
    source: string,
    filePath = false
  ): Promise<MyFitnessPalNutrition[]> {
    const csvData = await readCSV(source, filePath);
    const mappings = await this.getNutrientMfpMapping();
    const labels: MyFitnessPalNutrition[] = csvData.map((row) => {
      const { date, meal, note, ...rest } = row.record;

      return {
        date: new Date(date),
        meal: meal,
        note: note,
        nutrients: Object.entries(rest).map(([name, value]) => {
          const nutrientName = mappings.get(name);
          if (!nutrientName) throw Error(`No mapping for ${name}`);
          return { name: nutrientName, amount: cast(value) as number };
        }),
        rawInput: row.raw,
      };
    });
    return labels;
  }

  async getNutrientMfpMapping(): Promise<Map<string, string>> {
    const result = await db.nutrient.findMany({
      where: { myFitnessPalMapping: { not: null } },
    });

    return result.reduce((aggregation, nutrient) => {
      aggregation.set(nutrient.myFitnessPalMapping as string, nutrient.id);
      return aggregation;
    }, new Map<string, string>());
  }
}
