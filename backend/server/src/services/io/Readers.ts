import fs from "fs";
import { parse } from "csv-parse";
import { toCamelCase } from "../../util/utils.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function readCSV(
  source: string | File,
  camelCaseHeaders = true
): Promise<{ [key: string]: string }[]> {
  let parser;
  const parserOptions = {
    delimiter: ",",
    columns: camelCaseHeaders
      ? (headers: string[]) => headers.map((header) => toCamelCase(header))
      : true,
    bom: true,
    raw: true,
  };
  if (typeof source === "object" && Object.hasOwn(source, "name")) {
    // Treat as a file object
    parser = parse(await source.text(), parserOptions);
  } else {
    const fullPath = path.join(__dirname, source as string);
    parser = fs.createReadStream(fullPath).pipe(parse(parserOptions));
  }

  const records: { [key: string]: string }[] = [];
  for await (const record of parser) {
    const typedRecord = record as { [key: string]: string };
    records.push(typedRecord);
  }
  return records;
}

function writeJson(relativePath: string, data: object[]) {
  fs.writeFileSync(path.join(__dirname, relativePath), JSON.stringify(data));
}

function readJSON(relativePath: string): object {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, relativePath), "utf8")
  ) as object;
}

function readFile(
  filePath: string,
  encoding: BufferEncoding = "utf-8"
): string {
  return fs.readFileSync(path.join(__dirname, filePath), encoding);
}

export { writeJson, readJSON, readCSV, readFile };
