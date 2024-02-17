import { ZodTypeAny } from "zod";
import { Open, CentralDirectory, File as ZipFile } from "unzipper";
import { getFileMetaData } from "../../../util/utils.js";
import fs from "fs/promises";
import { FileMetaData } from "../../../types/CustomTypes.js";
import { ImportType } from "@prisma/client";
import { db } from "../../../db.js";
import { hash } from "../../../util/utils.js";
import path from "path";
import { fileURLToPath } from "url";
import { Match } from "../../../types/CustomTypes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface ParsedOutput<O, T extends ParsedRecord<O>> {
  records: T[];
  recordHash: string;
  imageMapping: Map<string, string>;
  fileName: string | undefined;
}

abstract class ParsedRecord<O> {
  protected recordHash: string; // Add initializer to 'recordHash' property
  abstract externalId: string | undefined;
  abstract importType: ImportType;
  protected originalText: string;
  protected static nutrientMapping = new Map<string, string>();

  protected static async initializeMapping(importType: ImportType) {
    const nutrients = await db.nutrientMapping.findMany({
      where: { importType: importType },
      select: { lookupName: true, nutrientId: true },
    });

    nutrients.reduce((agg, val) => {
      agg.set(val.lookupName, val.nutrientId);
      return agg;
    }, ParsedRecord.nutrientMapping);
  }

  protected static async matchNutrient(
    externalId: string,
    importType: ImportType
  ) {
    if (ParsedRecord.nutrientMapping.size === 0) {
      await ParsedRecord.initializeMapping(importType);
    }
    return ParsedRecord.nutrientMapping.get(externalId);
  }

  constructor(input: string) {
    this.originalText = input;
    this.recordHash = hash(input);
  }

  getRecordHash(): string {
    return this.recordHash;
  }

  getExternalId(): string | undefined {
    return this.externalId;
  }

  getRawInput(): string {
    return this.originalText;
  }

  abstract transform<T extends ZodTypeAny>(
    schema: T,
    imageMapping?: Map<string, string>,
    matchingId?: string
  ): Promise<O>;
}

abstract class Parser<O, T extends ParsedRecord<O>> {
  protected abstract records: T[];
  protected abstract fileHash: string | undefined;
  // Original file name -> hash
  protected imageMapping = new Map<string, string>();
  protected source: string | File;
  protected abstract fileName: string | undefined;

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

  abstract parse(): Promise<ParsedOutput<O, T>>;

  protected async unzipFile(source: string | File): Promise<CentralDirectory> {
    if (typeof source === "string") {
      try {
        const newPath = path.isAbsolute(source)
          ? source
          : path.join(__dirname, source);
        await fs.access(newPath);
        return await Open.file(newPath);
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
