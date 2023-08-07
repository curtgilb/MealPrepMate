import fs from "fs";
import { parse } from "csv-parse";

type CronometerFood = {
  "B12 (Cobalamin) (µg)": string;
};

class CSVReader {
  async read(path: string) {
    const records = [];
    const parser = fs.createReadStream(path).pipe(
      parse({
        delimiter: ",",
      })
    );

    for await (const record of parser) {
      // Work with each record
      records.push(record);
    }
  }
}

const reader = new CSVReader();
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
await reader.read(
  "C:\\Users\\cgilb\\Documents\\Code\\mealplanner\\backend\\server\\data\\servings(1).csv"
);
