import { CentralDirectory, Open, File as ZipFile } from "unzipper";
import { FileMetaData } from "../../../../types/CustomTypes.js";
import { getFileMetaData, hash } from "../../../../util/utils.js";
import { openFileBuffer } from "../../../io/Readers.js";
import { ParsedRecord } from "./ParsedRecord.js";

// O is the final output type
// T is the type of parser like reciperKeeper or cronometer
interface ParsedOutput<O, T extends ParsedRecord<O>> {
  records: T[];
}

interface ParsedOutputFromFile<O, T extends ParsedRecord<O>>
  extends ParsedOutput<O, T> {
  hash: string | undefined;
  imageMapping: Map<string, string>;
}

abstract class Parser<O, T extends ParsedRecord<O>> {
  protected source: string | File;
  protected abstract records: T[];

  constructor(source: string | File) {
    this.source = source;
  }

  abstract parse(): Promise<ParsedOutput<O, T>>;
}

abstract class FileParser<O, T extends ParsedRecord<O>> extends Parser<O, T> {
  protected abstract records: T[];
  protected fileHash: string | undefined;
  // Original file name -> hash
  protected imageMapping = new Map<string, string>();

  constructor(source: string | File) {
    super(source);
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

  abstract parse(): Promise<ParsedOutputFromFile<O, T>>;

  protected async unzipFile(source: string | File): Promise<CentralDirectory> {
    if (typeof source === "string") {
      const buffer = openFileBuffer(source);
      this.fileHash = hash(buffer);
      return await Open.buffer(buffer);
    } else if (source instanceof File) {
      const fileBuffer = Buffer.from(await source.arrayBuffer());
      this.fileHash = hash(fileBuffer);
      return await Open.buffer(fileBuffer);
    }
    throw Error(`Invalid object passed to unzipFile`);
  }
}

export { Parser, FileParser, ParsedOutputFromFile };
