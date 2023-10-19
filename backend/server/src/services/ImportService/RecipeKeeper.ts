import { Open, CentralDirectory, File as ZipFile } from "unzipper";
import fs from "fs/promises";
import { hash } from "./ImportService.js";
import { db } from "../../db.js";
import { v4 as uuidv4 } from "uuid";
import { storage } from "../../storage.js";
import { readHTML } from "../../importHelpers/Readers.js";
import { RecipeKeeperRecipe } from "../../importHelpers/RecipeKeeperParser.js";
import { compareTwoStrings } from "../../util/utils.js";
import { getFileMetaData, FileMetaData } from "./ImportService.js";

// TODO
// Hash file to see if HTML is the same
// Enum on the status

type RecipeKeeperExtractedData = {
  htmlHash: string;
  fileMeta: FileMetaData;
  recipes: RecipeKeeperRecipe[];
  images: { [key: string]: string };
};

export async function processRecipeKeeperImport(source: string | File) {
  const fileBuffer = await unzipFile(source);
  const lastImport = await db.import.findFirst({
    orderBy: { createdAt: "desc" },
  });
  const { htmlHash, fileMeta, recipes, images } = await extractRecipes(
    fileBuffer
  );
  if (lastImport?.fileHash === htmlHash)
    throw Error("No changes made since the last import");
  await findRecipeMatches(recipes);
  return await saveRecipeData(fileMeta.name, htmlHash, images, recipes);
}

async function saveRecipeData(
  fileName: string,
  fileHash: string,
  imageMapping: { [key: string]: string },
  recipes: RecipeKeeperRecipe[]
) {
  return await db.import.create({
    data: {
      fileName,
      fileHash,
      type: "RECIPE_KEEPER",
      status: "PENDING",
      imageMapping: JSON.stringify(imageMapping),
      path: "",
      importRecords: {
        createMany: {
          data: recipes.map((recipe) => {
            return {
              rawInput: recipe.rawInput,
              name: recipe.name,
              status: recipe.status,
              recipeId: recipe.matchId,
            };
          }),
        },
      },
    },
  });
}

async function findRecipeMatches(recipes: RecipeKeeperRecipe[]) {
  const existingRecipes = await db.recipe.findMany({
    select: {
      id: true,
      title: true,
    },
  });

  for (const recipe of recipes) {
    // Check for an exact match by comparing raw input
    const successfulMatch1 = await findExactRecipe(recipe);

    // Check for updateable match by comparing keys (title + ingredients) for a similar match
    if (!successfulMatch1 && existingRecipes.length > 0) {
      const successfulMatch2 = findApproximateRecipe(recipe, existingRecipes);

      // Otherwise mark it as a new recipe and create it
      if (!successfulMatch2) {
        recipe.status = "IMPORTED";
      }
    }
  }
}

async function findExactRecipe(recipe: RecipeKeeperRecipe): Promise<boolean> {
  const firstMatch = await db.importRecord.findFirst({
    where: {
      rawInput: {
        equals: recipe.rawInput,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (firstMatch && firstMatch.recipeId) {
    recipe.matchId = firstMatch.recipeId;
    recipe.status = "DUPLICATE";
    return true;
  }
  return false;
}

function findApproximateRecipe(
  recipe: RecipeKeeperRecipe,
  existingRecipes: {
    id: string;
    title: string;
  }[]
): boolean {
  const newComparisonKey = recipe.name;
  let highestPercentMatch = 0;

  const secondMatch = existingRecipes.filter((existingRecipe) => {
    const oldComparisonKey = existingRecipe.title;
    const percentMatch = compareTwoStrings(oldComparisonKey, newComparisonKey);

    if (percentMatch > 0.8 && percentMatch > highestPercentMatch) {
      highestPercentMatch = percentMatch;
      return true;
    }
    return false;
  });

  if (secondMatch.length > 0) {
    recipe.matchId = secondMatch[0].id;
    recipe.status = "PENDING";
    return true;
  }
  return false;
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
        recipeKeeperRecipes = readHTML(htmlData);
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
    const fileBuffer = Buffer.from(await (source as File).arrayBuffer());
    return await Open.buffer(fileBuffer);
  }
  throw Error();
}
