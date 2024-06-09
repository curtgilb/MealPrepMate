import { File as ZipFile } from "unzipper";
import { z } from "zod";
import { CreateNutritionLabelInput } from "../../../types/gql.js";
import { hash } from "../../../util/utils.js";
import { readFile } from "../../io/Readers.js";
import { NutritionLabelParsedRecord } from "./base/ParsedRecord.js";
import { ParsedOutputFromFile } from "./base/Parser.js";
import { FileParser } from "./base/Parser.js";

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

class CronometerParser extends FileParser<
  CreateNutritionLabelInput,
  CronometerParsedRecord
> {
  records: CronometerParsedRecord[] = [];

  constructor(source: string | File) {
    super(source);
  }

  async parse(): Promise<
    ParsedOutputFromFile<CreateNutritionLabelInput, CronometerParsedRecord>
  > {
    // Single JSON file path
    if (typeof this.source === "string" && this.source.endsWith(".json")) {
      const data = readFile(this.source);
      this.records.push(new CronometerParsedRecord(data));
    }
    // Zip file
    else {
      const directory = await this.unzipFile(this.source);
      await this.traverseDirectory(directory);
    }
    return {
      records: this.records,
      hash: hash(
        this.source instanceof File
          ? Buffer.from(await this.source.arrayBuffer())
          : this.source
      ),
      imageMapping: this.imageMapping,
    };
  }

  protected async processFile(file: ZipFile): Promise<void> {
    const fileData = (await file.buffer()).toString();
    this.records.push(new CronometerParsedRecord(fileData));
  }
}

class CronometerParsedRecord extends NutritionLabelParsedRecord<CreateNutritionLabelInput> {
  private parsedData: CronometerJson;

  constructor(input: string) {
    super(input, "CRONOMETER");
    this.parsedData = JSON.parse(input) as CronometerJson;
    this.externalId = String(this.parsedData.id);
  }

  getParsedData(): CronometerJson {
    return this.parsedData;
  }

  private getServings(): number {
    const servings = this.parsedData.measures.find(
      (measure) => measure.name === "serving"
    )?.value;
    return servings ?? 1;
  }

  async transform<T extends z.ZodTypeAny>(
    schema: T,
    imageMapping?: Map<string, string>,
    matchingId?: string
  ): Promise<z.infer<T>> {
    const nutrients = await Promise.all(
      this.parsedData.nutrients
        .filter((nutrient) => nutrient.amount > 0)
        .map(async (nutrient) => ({
          value: nutrient.amount,
          nutrientId: await CronometerParsedRecord.matchNutrient(
            nutrient.id.toString(),
            this.importSource
          ),
        }))
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return schema.parse({
      name: this.parsedData.name,
      connectingId: matchingId,
      servings: this.getServings(),
      nutrients: nutrients.filter(
        (nutrient) => nutrient.nutrientId !== undefined
      ),
    }) as z.infer<T>;
  }
}

export { CronometerParser, CronometerParsedRecord, CronometerJson };
