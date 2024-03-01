import fs from "fs";
import { storage } from "../../storage.js";
import { parse } from "csv-parse";
import { getFileMetaData, toCamelCase } from "../../util/utils.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export type CsvOutput = {
  record: { [key: string]: string };
  raw: string;
};

async function readCSV(
  source: string,
  isPath: boolean = true,
  camelCaseHeaders = true
): Promise<CsvOutput[]> {
  const parserOptions = {
    delimiter: ",",
    columns: camelCaseHeaders
      ? (headers: string[]) => headers.map((header) => toCamelCase(header))
      : true,
    bom: true,
    raw: true,
  };
  let parser;
  if (isPath) {
    const fullPath = path.join(__dirname, source);
    parser = fs.createReadStream(fullPath).pipe(parse(parserOptions));
  } else {
    parser = parse(source, parserOptions);
  }

  const records: CsvOutput[] = [];
  for await (const record of parser) {
    const typedRecord = record as CsvOutput;
    records.push(typedRecord);
  }
  return records;
}

function writeJson(relativePath: string, data: unknown) {
  if (typeof data !== "object") {
    throw Error("Data must be an object type");
  }
  fs.writeFileSync(path.join(__dirname, relativePath), JSON.stringify(data));
}

function readJSON<T>(relativePath: string): T {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, relativePath), "utf8")
  ) as T;
}

function readFile(
  filePath: string,
  encoding: BufferEncoding = "utf-8"
): string {
  return fs.readFileSync(path.join(__dirname, filePath), encoding);
}

function openFile(source: string | File): File {
  if (typeof source === "string") {
    try {
      const newPath = path.isAbsolute(source)
        ? source
        : path.join(__dirname, source);
      fs.accessSync(newPath);
      const meta = getFileMetaData(newPath);
      const buffer = fs.readFileSync(newPath);
      return new File([new Blob([buffer])], meta.name);
    } catch {
      throw Error(`File at ${source} could not be opened.`);
    }
  }
  return source;
}

function openS3File(bucketFolder: string, fileName: string): Promise<File> {
  const file = new Promise<File>((resolve, reject) => {
    const chunks: Buffer[] = [];

    storage.getObject(bucketFolder, fileName, (err, dataStream) => {
      if (err) {
        reject(err);
      }
      dataStream.on("data", (chunk) => {
        if (chunk instanceof Buffer) chunks.push(chunk);
      });
      dataStream.on("end", () => {
        const buffer = Buffer.concat(chunks);
        const blob = new Blob([buffer]);
        resolve(new File([blob], fileName));
      });
      dataStream.on("error", (err) => {
        reject(err);
      });
    });
  });
  return file;
}

export { writeJson, readJSON, readCSV, readFile, openFile, openS3File };
