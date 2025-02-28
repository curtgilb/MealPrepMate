import { getPath, project_root } from "@/infrastructure/file_io/common.js";
import { toCamelCase } from "@/application/util/utils.js";
import { parse } from "csv-parse";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { z, ZodTypeAny } from "zod";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getFileContentsFromStream(
  filePath: string,
  encoding: BufferEncoding = "utf-8"
): Promise<string> {
  return new Promise((resolve, reject) => {
    let fileData = "";
    const fullPath = getPath(filePath);

    const readStream = fs.createReadStream(fullPath, { encoding });

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

interface ReadCSVParameters<T extends ZodTypeAny> {
  path?: string;
  camelCaseHeaders: boolean;
  source?: string;
  schema: T;
}

async function readCSV<T extends ZodTypeAny>({
  path,
  camelCaseHeaders,
  source,
  schema,
}: ReadCSVParameters<T>): Promise<z.infer<T>[]> {
  const parserOptions = {
    delimiter: ",",
    columns: camelCaseHeaders
      ? (headers: string[]) => headers.map((header) => toCamelCase(header))
      : true,
    bom: true,
    raw: true,
  };
  let parser;
  if (path) {
    const fullPath = getPath(path);
    parser = fs.createReadStream(fullPath).pipe(parse(parserOptions));
  } else if (source) {
    parser = parse(source, parserOptions);
  }

  const records: z.infer<T>[] = [];
  for await (const { record } of parser) {
    const typedRecord = schema.parse(record);
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
      const fullPath = getPath(sourcePath);
      return fs.readFileSync(fullPath);
    } catch {
      throw Error(`File at ${sourcePath} could not be opened.`);
    }
  }
  throw new Error("Wrong type");
}

export { openFileAsBuffer as openFileBuffer, readCSV, readFile, readJSON };
