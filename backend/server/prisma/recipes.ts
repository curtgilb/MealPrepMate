import { parse } from "node-html-parser";
import fs from "fs/promises";
import fetch from "node-fetch";
import { PrismaClient } from "@prisma/client";

// type ParsedRecipe = {
//   photos: string[];
//   recipeCollection: string[];
//   recipeCategory: string[];
//   [key: string]: string | string[];
// };

type TaggedRecipe = {
  id: string;
  comment: string;
  name: string;
  other: string;
  quantity: string;
  sentence: string;
  unit: string;
};
function sanitizeInput(input: string) {
  const workingCopy: string[] = input
    .split("\r\n")
    .filter((text) => text !== "")
    .map((text) => text.replace("•", "").trim());
  return workingCopy.join("\n");
}

// function getServings(input: string) {}

function getTime(input: string): number {
  const match = Array.from(input.matchAll(/(?<time>\d+)(?<unit>.)/gm))[0];
  const time: number = parseInt(match.groups.time);
  const unit: string = match.groups.unit;
  if (unit === "S") {
    return time / 60;
  } else if (unit === "H") {
    return time * 60;
  } else {
    return time;
  }
}

function createManyDBStatement(
  rawList: any[],
  dbColumn: string,
  transformer: (input: any, propName?: string) => object,
  propName?: string
): object {
  const dbStmt = {};
  const data = [];
  if (rawList.length === 0) {
    return {};
  } else {
    for (const item of rawList) {
      data.push(transformer(item, propName));
    }
  }

  dbStmt[dbColumn] = { create: data };

  return dbStmt;
}

function convertToDBObject(input: string, propName: string): object {
  const newObject = {};
  newObject[propName] = input;
  return newObject;
}

function transformPhotosForDb(photoPath: string) {
  return { path: photoPath, isPrimary: photoPath.slice(-5) === "0" };
}

async function main() {
  const prisma = new PrismaClient();
  try {
    const data = await fs.readFile(
      "C:\\Users\\cgilb\\Documents\\Code\\mealplanner\\backend\\server\\data\\seed\\RecipeKeeper\\recipes.html",
      {
        encoding: "utf8",
      }
    );
    const html = parse(data);

    // Grab all recipes
    const recipes = html.querySelectorAll(".recipe-details");
    for (const recipe of recipes) {
      // Grab all elements that are properties of each recipe
      const properties = recipe.querySelectorAll("*[itemProp]");
      const parsedRecipe: { [key: string]: string | string[] } = {
        photos: [],
        recipeCollection: [],
        recipeCategory: [],
      };

      properties.forEach((property) => {
        // check for content attribute

        const propName = property.getAttribute("itemprop");
        // Add Photos
        if (propName.startsWith("photo")) {
          (parsedRecipe.photos as string[]).push(property.getAttribute("src"));
          // Add collections and categories
        } else if (
          propName.includes("Category") ||
          propName.includes("Collection")
        ) {
          (parsedRecipe[propName] as string[]).push(
            property.getAttribute("content")
          );
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
      });
      getTime(parsedRecipe.prepTime as string);

      // Tag ingreient data
      const ingredients: string[] = (
        parsedRecipe["recipeIngredients"] as string
      ).split("\n");
      const body = {
        ingredients,
        confidence: false,
      };

      const response = await fetch("http://127.0.0.1/parse", {
        method: "post",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });
      const taggedIngredients = (await response.json()) as TaggedRecipe[];
      for (const ingredient of taggedIngredients) {
        let result = await prisma.ingredient.findFirst({
          where: {
            OR: [
              {
                primaryName: {
                  equals: ingredient.name,
                  mode: "insensitive",
                },
              },
              {
                alternateNames: {
                  some: {
                    name: {
                      equals: ingredient.name,
                      mode: "insensitive",
                    },
                  },
                },
              },
            ],
          },
          select: {
            id: true,
            primaryName: true,
          },
        });

        //  create if the ingredient doesn't exist
        if (result === null) {
          result = await prisma.ingredient.create({
            data: {
              primaryName: ingredient.name,
            },
          });
          console.log(`Created ${ingredient.name}`);
        }
        ingredient.id = result.id;
      }

      // Create in database

      const dbStmt = {
        data: {
          title: parsedRecipe.name as string,
          recipeKeeperId: parsedRecipe.recipeId as string,
          source: parsedRecipe.recipeSource as string,
          servingsText: parsedRecipe.recipeYield as string,
          preparationTime: getTime(parsedRecipe.prepTime as string),
          cookingTime: getTime(parsedRecipe.cookTime as string),
          directions: parsedRecipe.recipeDirections as string,
          notes: parsedRecipe.recipeNotes as string,
          stars: parseInt(parsedRecipe.recipeRating as string),
          isFavorite: parsedRecipe.recipeIsFavourite === "true",
          ingredients: {
            create: taggedIngredients.map((taggedIngredient, index) => {
              return {
                sentence: taggedIngredient.sentence,
                order: index,
                quantity: parseFloat(taggedIngredient.quantity),
                unit: taggedIngredient.unit,
                name: taggedIngredient.name,
                comment: taggedIngredient.comment,
                ingredient: {
                  connect: {
                    id: taggedIngredient.id,
                  },
                },
              };
            }),
          },
        },
      };

      const photos = createManyDBStatement(
        parsedRecipe.photos as string[],
        "photos",
        transformPhotosForDb
      );
      const collections = createManyDBStatement(
        parsedRecipe.recipeCollection as string[],
        "collection",
        convertToDBObject,
        "collection"
      );
      const categories = createManyDBStatement(
        parsedRecipe.recipeCategory as string[],
        "category",
        convertToDBObject,
        "category"
      );

      dbStmt.data = {
        ...dbStmt.data,
        ...photos,
        ...collections,
        ...categories,
      };

      // Create the recipe
      const createdRecipe = await prisma.recipe.create(dbStmt);
      console.log("Recipe Created");

      // const ingredient = await prisma.ingredient.createMany({ data: taggedIngredients.map(ingredient => {primaryName: ingredient.name})  });
    }

    console.log("finish");
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}

await main();
