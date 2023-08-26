import fs from "fs";
import { parse } from "csv-parse";
import { parse as parseHTML } from "node-html-parser";
import { toCamelCase } from "../util/utils";
import path from "path";
import { RecipeKeeperRecipe } from "./ImportTypes";

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

function readJSON(relativePath: string): object[] {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, relativePath), "utf8")
  ) as object[];
}

function sanitizeInput(input: string) {
  const workingCopy: string[] = input
    .split("\r\n")
    .filter((text) => text !== "")
    .map((text) => text.replace("•", "").trim());
  return workingCopy.join("\n");
}

function readHTML(filePath: string): RecipeKeeperRecipe[] {
  const data = fs.readFileSync(path.join(__dirname, filePath), "utf-8");
  const html = parseHTML(data);
  const recipes = html.querySelectorAll(".recipe-details");
  const parsedRecipes: RecipeKeeperRecipe[] = [];
  for (const recipe of recipes) {
    // Grab all elements that are properties of each recipe
    const properties = recipe.querySelectorAll("*[itemProp]");
    const parsedRecipe: RecipeKeeperRecipe = {
      recipeCourse: [],
      recipeCategory: [],
      recipeCollection: [],
      photos: [],
    };

    properties.forEach((property) => {
      const propName = property.getAttribute("itemprop");
      if (propName !== undefined) {
        if (propName.startsWith("photo")) {
          parsedRecipe.photos.push(property.getAttribute("src") as string);
          // Add collections and categories
        } else if (
          propName.includes("Category") ||
          propName.includes("Collection") ||
          propName.includes("Course")
        ) {
          const value = property.getAttribute("content");
          if (value !== undefined && value !== null && value !== "") {
            (parsedRecipe[propName] as string[]).push(
              property.getAttribute("content") as string
            );
          }
        }
        // Add all others
        else {
          let propValue: string;
          if ("content" in property.attributes) {
            propValue = property.getAttribute("content");
          } else {
            propValue = sanitizeInput(property.text);
          }
          parsedRecipe[propName] = propValue !== "" ? propValue : undefined;
        }
      }
    });
    parsedRecipes.push(parsedRecipe);
  }
  return parsedRecipes;
}

export { writeJson, readJSON, readCSV, readHTML };
