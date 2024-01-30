import { ZodTypeAny } from "zod";
import { Open, CentralDirectory, File as ZipFile } from "unzipper";
import { getFileMetaData } from "../import/ImportService.js";
import fs from "fs/promises";
import { FileMetaData } from "../../types/CustomTypes.js";
import { ImportType } from "@prisma/client";
import { db } from "../../db.js";
import { hash } from "../../util/utils.js";

interface ParsedOutput<O> {
  records: ParsedRecord<O>[];
  recordHash: string;
  imageMapping?: Map<string, string>;
}

abstract class ParsedRecord<O> {
  protected recordHash: string; // Add initializer to 'recordHash' property
  abstract externalId: string | number | undefined;
  abstract importType: ImportType;
  protected originalText: string;
  protected static nutrientMapping = new Map<string, string>();

  constructor(input: string) {
    this.originalText = input;
    this.recordHash = hash(input);
  }

  abstract toObject<T extends ZodTypeAny>(schema: T): Promise<O>;

  async matchNutrients(id: number): Promise<string | undefined> {
    await this.intializeMapping();
    return ParsedRecord.nutrientMapping.get(id.toString());
  }

  async intializeMapping() {
    if (Object.keys(ParsedRecord.nutrientMapping).length === 0) {
      const nutrients = await db.nutrient.findMany({
        where: { mappings: { some: { importType: this.importType } } },
        select: { id: true, mappings: { select: { lookupName: true } } },
      });

      nutrients.reduce((agg, val) => {
        if (val.mappings.length > 0) {
          agg.set(val.mappings[0].lookupName, val.id);
        }
        return agg;
      }, ParsedRecord.nutrientMapping);
    }
  }
}

abstract class Parser<O> {
  protected abstract records: ParsedRecord<O>[];
  protected abstract fileHash: string;
  // Original file name -> hash
  protected imageMapping = new Map<string, string>();
  protected source: string | File;

  constructor(source: string | File) {
    this.source = source;
  }

  protected async traverseDirectory(folder: CentralDirectory): Promise<void> {
    for (const file of folder.files) {
      if (file.type === "File") {
        const metaData = getFileMetaData(file.path);
        await this.processFile(file, metaData);
      }
    }
  }

  protected abstract processFile(
    file: ZipFile,
    metaData: FileMetaData
  ): Promise<void>;

  abstract parse(): Promise<ParsedOutput<O>>;

  protected async unzipFile(source: string | File): Promise<CentralDirectory> {
    if (typeof source === "string") {
      try {
        await fs.access(source);
        return await Open.file(source);
      } catch {
        throw Error(`File at ${source} could not be opened.`);
      }
    } else if (typeof source == "object" && Object.hasOwn(source, "name")) {
      const fileBuffer = Buffer.from(await source.arrayBuffer());
      return await Open.buffer(fileBuffer);
    }
    throw Error(`Invalid object passed to unzipFile`);
  }
}

export { Parser, ParsedRecord, ParsedOutput };
