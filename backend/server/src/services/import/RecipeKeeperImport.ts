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
  fileMeta: FileMetaData;
  recipes: RecipeKeeperRecipe[];
  images: { [key: string]: string };
};

export async function processRecipeKeeperImport(
  source: string | File,
  query: ImportQuery
) {
  const fileBuffer = await unzipFile(source);
  const lastImport = await db.import.findFirst({
    where: { type: "RECIPE_KEEPER" },
    orderBy: { createdAt: "desc" },
  });

  const { htmlHash, fileMeta, recipes, images } =
    await extractRecipes(fileBuffer);

  if (lastImport?.fileHash === htmlHash)
    throw Error("No changes made since the last import");

  const matches = await findRecipeMatches(recipes);
  return await saveRecipeData(
    fileMeta.name,
    htmlHash,
    images,
    recipes,
    matches,
    query
  );
}

async function saveRecipeData(
  fileName: string,
  fileHash: string,
  imageMapping: { [key: string]: string },
  recipes: RecipeKeeperRecipe[],
  matches: Match[],
  query: ImportQuery
) {
  return await db.$transaction(async (tx) => {
    for (const [index, recipe] of recipes.entries()) {
      if (!matches[index].matchingRecipeId) {
        const createStmt = await tx.recipe.createRecipeKeeperRecipe(
          recipe,
          imageMapping
        );
        const result = await tx.recipe.create({
          data: createStmt,
          select: { id: true },
        });
        matches[index].matchingRecipeId = result.id;
      }
    }
    return await tx.import.create({
      data: {
        fileName,
        fileHash,
        type: "RECIPE_KEEPER",
        status: "PENDING",
        imageMapping: imageMapping as Prisma.JsonObject,
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

async function findRecipeMatches(
  recipes: RecipeKeeperRecipe[]
): Promise<Match[]> {
  const matches: Match[] = [];

  for (const recipe of recipes) {
    // Check for an exact match by comparing raw input
    const previousMatch = await findExactRecipe(recipe);

    if (previousMatch) {
      matches.push({
        matchingRecipeId: previousMatch.id,
        importStatus: "DUPLICATE",
      });
      continue;
    } else {
      // Check for updateable match by comparing keys (title + ingredients) for a similar match
      const existingRecipes = await db.recipe.findMany({
        select: {
          id: true,
          title: true,
          directions: true,
        },
      });
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
  const imageToHash: { [key: string]: string } = {};
  let htmlHash;
  let htmlFileMeta;
  for (const file of zipFile.files) {
    if (file.type === "File") {
      const fileMeta = getFileMetaData(file.path);
      if (fileMeta.ext === "html") {
        const htmlData = (await file.buffer()).toString();
        htmlHash = hash(htmlData);
        htmlFileMeta = JSON.parse(JSON.stringify(fileMeta)) as FileMetaData;
        const parser = new RecipeKeeperParser();
        recipeKeeperRecipes = await parser.parse(htmlData);
      } else if (["jpg", "png", "tiff"].includes(fileMeta.ext)) {
        await processImage(file, imageToHash, fileMeta);
      }
    }
  }
  if (!htmlHash) throw Error("No Html file was found in zip file");
  if (!htmlFileMeta) throw Error("No HTML file was found in zip file");
  return {
    htmlHash: htmlHash,
    recipes: recipeKeeperRecipes,
    images: imageToHash,
    fileMeta: htmlFileMeta,
  };
}

async function processImage(
  image: ZipFile,
  hashLookup: { [key: string]: string },
  fileMeta: FileMetaData
) {
  const hashOutput = hash(await image.buffer());
  // const hashTextOutput = hash(image.buffer().)
  const foundImage = await db.photo.findUnique({
    where: { hash: hashOutput },
  });
  if (!foundImage) {
    const fileName = `${uuidv4()}.${fileMeta.ext}`;
    await storage.putObject("images", fileName, await image.buffer());
    await db.photo.create({
      data: {
        path: `images/${fileName}`,
        hash: hashOutput,
      },
    });
  }
  hashLookup[fileMeta.name] = hashOutput;
}

async function unzipFile(source: string | File): Promise<CentralDirectory> {
  if (typeof source === "string") {
    try {
      // const fullPath = path.join(__dirname, filePath);
      await fs.access(source);
      return await Open.file(source);
    } catch {
      throw Error(`File at ${source} could not be opened.`);
    }
  } else if (typeof source == "object" && Object.hasOwn(source, "name")) {
    const fileBuffer = Buffer.from(await source.arrayBuffer());
    return await Open.buffer(fileBuffer);
  }
  throw Error();
}
