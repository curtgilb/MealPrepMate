import { Open, CentralDirectory, File as ZipFile } from "unzipper";
import fs from "fs/promises";
import { hash } from "../../util/utils.js";
import { v4 as uuidv4 } from "uuid";
import { storage } from "../../storage.js";
import { RecipeKeeperRecipe } from "../../types/CustomTypes.js";
import { RecipeKeeperParser } from "../parsers/RecipeKeeperParser.js";
import { compareTwoStrings } from "../../util/utils.js";
import { getFileMetaData, FileMetaData } from "./ImportService.js";
import { Prisma, ImportRecord, RecordStatus, Recipe } from "@prisma/client";
import { db } from "../../db.js";
import { ImportQuery } from "../../types/CustomTypes.js";

const APPROX_MATCH_THRESHOLD = 0.8;

type RecipeKeeperExtractedData = {
  htmlHash: string;
  fileMetaData: FileMetaData;
  recipes: RecipeKeeperRecipe[];
  imageNameToHash: { [key: string]: string };
};

export async function processRecipeKeeperImport(
  source: string | File,
  query: ImportQuery
) {
  // 1. unzip file and get the last import to compare against (if it is the same hash, it will not import)
  const fileBuffer = await unzipFile(source);
  const lastImport = await db.import.findFirst({
    where: { type: "RECIPE_KEEPER" },
    orderBy: { createdAt: "desc" },
  });

  // 2. Extract files including images, search for html file, return if already imported
  const { htmlHash, fileMetaData, recipes, imageNameToHash } =
    await extractRecipes(fileBuffer);

  if (lastImport?.fileHash === htmlHash)
    throw Error("No changes made since the last import");

  //  3. Search for any matching recipes already in the database.
  const matches = await findRecipeMatches(recipes);

  //  4. Save the data to the database
  return await saveRecipeData(
    fileMetaData.name,
    htmlHash,
    imageNameToHash,
    recipes,
    matches,
    query
  );
}

async function saveRecipeData(
  htmlFileName: string,
  htmlFileHash: string,
  imageNameToHash: { [key: string]: string },
  recipes: RecipeKeeperRecipe[],
  matches: Match[],
  query: ImportQuery
) {
  return await db.$transaction(async (tx) => {
    for (const [index, recipe] of recipes.entries()) {
      if (!matches[index].matchingRecipeId) {
        const importedRecipe = await tx.recipe.createRecipeKeeperRecipe(
          recipe,
          imageNameToHash
        );
        matches[index].matchingRecipeId = importedRecipe.id;
      }
    }
    return await tx.import.create({
      data: {
        fileName: htmlFileName,
        fileHash: htmlFileHash,
        type: "RECIPE_KEEPER",
        status: "PENDING",
        imageMapping: imageNameToHash as Prisma.JsonObject,
        importRecords: {
          createMany: {
            data: recipes.map((recipe, index) => ({
              name: recipe.name,
              status: matches[index].importStatus,
              parsedFormat: recipe as Prisma.JsonObject,
              rawInput: recipe.rawInput,
              recipeId: matches[index].matchingRecipeId,
            })),
          },
        },
      },
      ...query,
    });
  });
}

export type Match = {
  matchingRecipeId?: string | undefined;
  matchingLabelId?: string | undefined;
  importStatus: RecordStatus;
};

// Order of matches returned is important. They should align with the recipes array passed in.
async function findRecipeMatches(
  recipes: RecipeKeeperRecipe[]
): Promise<Match[]> {
  const matches: Match[] = [];
  const existingRecipes = await db.recipe.findMany({
    select: {
      id: true,
      title: true,
      directions: true,
    },
  });

  for (const recipe of recipes) {
    // 1. Check for an exact match by comparing raw input
    const previousMatch = await findExactRecipe(recipe);

    if (previousMatch) {
      matches.push({
        matchingRecipeId: previousMatch.id,
        importStatus: "DUPLICATE",
      });
      continue;
    } else {
      // 2. Check for updateable match by comparing keys (title + ingredients) for a similar match

      if (existingRecipes.length > 0) {
        const approximateMatch = findApproximateRecipe(recipe, existingRecipes);
        if (approximateMatch) {
          matches.push({
            matchingRecipeId: approximateMatch.id,
            importStatus: "PENDING",
          });
          continue;
        }
      }
      // 3. If no match is found, mark the recipe to be imported
      matches.push({ matchingRecipeId: undefined, importStatus: "IMPORTED" });
    }
  }
  return matches;
}

async function findExactRecipe(
  recipe: RecipeKeeperRecipe
): Promise<ImportRecord | null> {
  return await db.importRecord.findFirst({
    where: {
      rawInput: {
        equals: recipe.rawInput,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

function findApproximateRecipe(
  recipe: RecipeKeeperRecipe,
  existingRecipes: {
    id: string;
    title: string;
    directions: string | null;
  }[]
): Recipe | undefined {
  const newComparisonKey = `${recipe.name} ${recipe.recipeDirections}`;
  let highestPercentMatch = 0;
  let bestMatch;

  existingRecipes.forEach((existingRecipe) => {
    const oldComparisonKey = `${existingRecipe.title} ${existingRecipe.directions}`;
    const percentMatch = compareTwoStrings(oldComparisonKey, newComparisonKey);

    if (
      percentMatch > APPROX_MATCH_THRESHOLD &&
      percentMatch > highestPercentMatch
    ) {
      highestPercentMatch = percentMatch;
      bestMatch = existingRecipe;
    }
  });
  return bestMatch;
}

async function extractRecipes(
  zipFile: CentralDirectory
): Promise<RecipeKeeperExtractedData> {
  let recipeKeeperRecipes: RecipeKeeperRecipe[] = [];
  const imageNameToHash: { [key: string]: string } = {};
  let htmlFileHash;
  let htmlFileMetaData;

  for (const file of zipFile.files) {
    if (file.type === "File") {
      const fileMetaData = getFileMetaData(file.path);
      if (fileMetaData.ext === "html") {
        const htmlData = (await file.buffer()).toString();
        htmlFileHash = hash(htmlData);
        htmlFileMetaData = JSON.parse(
          JSON.stringify(fileMetaData)
        ) as FileMetaData;
        const parser = new RecipeKeeperParser();
        recipeKeeperRecipes = await parser.parse(htmlData);
      } else if (["jpg", "png", "tiff"].includes(fileMetaData.ext)) {
        await processImage(file, imageNameToHash, fileMetaData);
      }
    }
  }
  if (!htmlFileHash) throw Error("No Html file was found in zip file");
  if (!htmlFileMetaData) throw Error("No HTML file was found in zip file");
  return {
    htmlHash: htmlFileHash,
    recipes: recipeKeeperRecipes,
    imageNameToHash: imageNameToHash,
    fileMetaData: htmlFileMetaData,
  };
}

async function processImage(
  image: ZipFile,
  hashLookup: { [key: string]: string },
  fileMeta: FileMetaData
) {
  // 1. Hash the image and check if it exists in the database
  const inputImageHash = hash(await image.buffer());
  const existingImage = await db.photo.findUnique({
    where: { hash: inputImageHash },
  });

  // 2. If it does not exist, upload it to the storage and add it to the database
  if (!existingImage) {
    const fileName = `${uuidv4()}.${fileMeta.ext}`;
    await storage.putObject("images", fileName, await image.buffer());
    await db.photo.create({
      data: {
        path: `images/${fileName}`,
        hash: inputImageHash,
      },
    });
  }
  //  3. Add the image to the map of image names to hashes
  hashLookup[fileMeta.name] = inputImageHash;
}

async function unzipFile(source: string | File): Promise<CentralDirectory> {
  if (typeof source === "string") {
    try {
      await fs.access(source);
      return await Open.file(source);
    } catch {
      throw Error(`File at ${source} could not be opened.`);
    }
  } else if (typeof source == "object" && Object.hasOwn(source, "name")) {
    const fileBuffer = Buffer.from(await source.arrayBuffer());
    return await Open.buffer(fileBuffer);
  }
  throw Error(`Invalid object passed to unzipFile`);
}
