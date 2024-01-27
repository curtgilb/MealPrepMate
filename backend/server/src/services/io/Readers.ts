import fs from "fs";
import { parse } from "csv-parse";
import { toCamelCase } from "../../util/utils.js";
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

function readText(relativePath: string): string {
  return fs.readFileSync(path.join(__dirname, relativePath), "utf8");
}

function readFile(
  filePath: string,
  encoding: BufferEncoding = "utf-8"
): string {
  return fs.readFileSync(path.join(__dirname, filePath), encoding);
}

export { writeJson, readJSON, readCSV, readFile, readText };
