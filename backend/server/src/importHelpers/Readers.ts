import fs from "fs";
import { parse } from "csv-parse";
import { parse as parseHTML } from "node-html-parser";
import { toCamelCase } from "../util/utils.js";
import path from "path";
import {
  RecipeKeeperTransformer,
  RecipeKeeperRecipe,
} from "../importHelpers/RecipeTransformer.js";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function readCSV(
  filePath: string,
  camelCaseHeaders = true
): Promise<{ [key: string]: string }[]> {
  const fullPath = path.join(__dirname, filePath);
  const records: { [key: string]: string }[] = [];
  const parser = fs.createReadStream(fullPath).pipe(
    parse({
      delimiter: ",",
      columns: camelCaseHeaders
        ? (headers: string[]) => headers.map((header) => toCamelCase(header))
        : true,
      bom: true,
    })
  );

  for await (const record of parser) {
    const typedRecord = record as { [key: string]: string };
    records.push(typedRecord);
  }
  return records;
}

function writeJson(relativePath: string, data: object[]) {
  fs.writeFileSync(
    path.join(__dirname, "./mappings.json"),
    JSON.stringify(data)
  );
}

function readJSON(relativePath: string): object {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, relativePath), "utf8")
  ) as object;
}

function readHTML(filePath: string): RecipeKeeperRecipe[] {
  const data = fs.readFileSync(path.join(__dirname, filePath), "utf-8");
  const html = parseHTML(data);
  const recipes = html.querySelectorAll(".recipe-details");
  const parsedRecipes: RecipeKeeperRecipe[] = [];
  for (const recipe of recipes) {
    // Grab all elements that are properties of each recipe
    const properties = recipe.querySelectorAll("*[itemProp]");
    const parsedRecipe = new RecipeKeeperTransformer();

    properties.forEach((property) => {
      parsedRecipe.parseHtmlElement(property);
    });
    parsedRecipes.push(parsedRecipe.toObject());
  }
  return parsedRecipes;
}

export { writeJson, readJSON, readCSV, readHTML };
