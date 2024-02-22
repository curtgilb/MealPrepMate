import { CreateNutritionLabelInput } from "../../../types/gql.js";
import { Parser, ParsedRecord, ParsedOutput } from "./Parser.js";
import { File as ZipFile } from "unzipper";
import { getFileMetaData, hash } from "../../../util/utils.js";
import { z } from "zod";
import { readText } from "../../io/Readers.js";
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
  externalId: string | undefined;
  parsedData: CronometerJson;
  importType: ImportType = "CRONOMETER";
  matchingRecipeId: string | undefined = undefined;

  constructor(input: string) {
    super(input);
    this.parsedData = JSON.parse(input) as CronometerJson;
    this.externalId = String(this.parsedData.id);
    this.recordHash = hash(input);
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
      this.parsedData.nutrients.map(async (nutrient) => ({
        value: nutrient.amount,
        nutrientId: await CronometerRecord.matchNutrient(
          nutrient.id.toString(),
          this.importType
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

class CronometerParser extends Parser<
  CreateNutritionLabelInput,
  CronometerRecord
> {
  protected records: CronometerRecord[] = [];
  protected fileName: string | undefined;
  protected fileHash: string | undefined;

  constructor(source: string | File) {
    super(source);
  }

  async parse(): Promise<
    ParsedOutput<CreateNutritionLabelInput, CronometerRecord>
  > {
    // Single JSON file path
    if (typeof this.source === "string" && this.source.endsWith(".json")) {
      this.fileName = this.source;
      const data = readText(this.source);
      this.fileHash = hash(data);
      this.records.push(new CronometerRecord(data));
    }
    // Zip file
    else {
      const directory = await this.unzipFile(this.source);

      this.fileName =
        this.source instanceof File
          ? this.source.name
          : getFileMetaData(this.source).path;
      await this.traverseDirectory(directory);
    }
    return {
      records: this.records,
      hash: this.fileHash,
      imageMapping: this.imageMapping,
      fileName: this.fileName,
    };
  }

  protected async processFile(file: ZipFile): Promise<void> {
    const fileData = (await file.buffer()).toString();
    this.records.push(new CronometerRecord(fileData));
  }
}

export { CronometerParser, CronometerRecord };
