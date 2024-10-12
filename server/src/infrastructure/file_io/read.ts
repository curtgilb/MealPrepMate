import { getPath } from "@/infrastructure/file_io/common.js";
import { toCamelCase } from "@/application/util/utils.js";
import { parse } from "csv-parse";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getFileContentsFromStream(
  filePath: string,
  encoding: BufferEncoding = "utf-8"
): Promise<string> {
  return new Promise((resolve, reject) => {
    let fileData = "";

    const readStream = fs.createReadStream(filePath, { encoding });

    readStream.on("data", (chunk) => {
      fileData += chunk;
    });

    readStream.on("end", () => {
      resolve(fileData); // Full content of the file
    });

    readStream.on("error", (err) => {
      reject(err);
    });
  });
}

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

async function readJSON<T>(
  path: string,
  encoding: BufferEncoding = "utf-8"
): Promise<T> {
  const validatedPath = getPath(path);
  const fileData = await getFileContentsFromStream(validatedPath, encoding);
  return JSON.parse(fileData) as T;
}

async function readFile(
  filePath: string,
  encoding: BufferEncoding = "utf-8"
): Promise<string> {
  const validatedPath = getPath(filePath);
  return await getFileContentsFromStream(validatedPath, encoding);
}

function openFileAsBuffer(sourcePath: string): Buffer {
  if (typeof sourcePath === "string") {
    try {
      const newPath = path.isAbsolute(sourcePath)
        ? sourcePath
        : path.join(__dirname, sourcePath);
      fs.accessSync(newPath);
      return fs.readFileSync(newPath);
    } catch {
      throw Error(`File at ${sourcePath} could not be opened.`);
    }
  }
  throw new Error("Wrong type");
}

export { openFileAsBuffer as openFileBuffer, readCSV, readFile, readJSON };
