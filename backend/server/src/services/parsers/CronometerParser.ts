import { CreateNutritionLabelInput } from "../../types/gql.js";
import { Parser, ParsedRecord, ParsedOutput } from "./Parser.js";
import { File as ZipFile } from "unzipper";

import { z } from "zod";
import { readText } from "../io/Readers.js";
import { ImportType } from "@prisma/client";

type CronometerJson = {
  nutrients: {
    amount: number;
    id: number;
    type: string;
  }[];
  measures: {
    amount: number;
    name: string;
    id: number;
    type: string;
    value: number;
  }[];
  rawImports: { [key: string]: string };
  name: string;
  defaultMeasureId: number;
  id: number;
};

class CronometerRecord extends ParsedRecord<CreateNutritionLabelInput> {
  recordHash: string;
  externalId: string | number | undefined;
  deserializedData: CronometerJson;
  importType: ImportType = "CRONOMETER";

  constructor(input: string) {
    super(input);
    this.deserializedData = JSON.parse(input) as CronometerJson;
    this.externalId = this.deserializedData.id;
  }

  private getServings(): number {
    const servings = this.deserializedData.measures.find(
      (measure) => measure.name === "serving"
    )?.value;
    return servings ?? 1;
  }

  async toObject<T extends z.ZodTypeAny>(
    schema: T,
    matchingId?: string
  ): Promise<z.infer<T>> {
    const nutrients = await Promise.all(
      this.deserializedData.nutrients.map(async (nutrient) => ({
        value: nutrient.amount,
        nutrientId: await this.matchNutrients(nutrient.id),
      }))
    );

    const label = schema.parse({
      name: this.deserializedData.name,
      connectingId: matchingId,
      servings: this.getServings(),
      nutrients: nutrients.filter(
        (nutrient) => nutrient.nutrientId !== undefined
      ),
    }) as z.infer<T>;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return label;
  }
}

class CronometerParser extends Parser<CreateNutritionLabelInput> {
  protected records: CronometerRecord[] = [];
  protected imageMapping: { [key: string]: string } = {};
  protected fileHash: string = "";

  constructor(source: string | File) {
    super(source);
  }
  async parse(): Promise<ParsedOutput<CreateNutritionLabelInput>> {
    // Single JSON file path
    if (typeof this.source === "string" && this.source.endsWith(".json")) {
      const data = readText(this.source);
      this.fileHash = hash(data);
      this.records.push(new CronometerRecord(data));
    }
    // Zip file path
    else {
      const directory = await this.unzipFile(this.source);
      await this.traverseDirectory(directory);
    }
    return {
      records: this.records,
      fileHash: this.fileHash,
    };
  }

  protected async processFile(file: ZipFile): Promise<void> {
    const fileData = (await file.buffer()).toString();
    this.records.push(new CronometerRecord(fileData));
  }
}

export { CronometerParser, CronometerRecord };
