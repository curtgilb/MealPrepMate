import { Open, CentralDirectory, File as ZipFile } from "unzipper";
import fs from "fs/promises";
import { getFileExtension } from "../../util/utils.js";
import { Prisma } from "@prisma/client";
import crypto from "crypto";
import { db } from "../../db.js";
import { v4 as uuidv4 } from "uuid";
import { storage } from "../../storage.js";
import { readHTML } from "../../importHelpers/Readers.js";
import { RecipeKeeperRecipe } from "../../importHelpers/RecipeTransformer.js";
import { compareTwoStrings } from "../../util/utils.js";

// TODO
// Hash file to see if HTML is the same
// Enum on the status

type FileMetaData = {
  path: string;
  name: string;
  ext: string;
};

type RecipeKeeperExtractedData = {
  recipes: RecipeKeeperRecipe[];
  images: { [key: string]: string };
};

export async function processReciperKeeperImport(source: string | File) {
  const fileBuffer = await unzipFile(source);
  const data = await extractRecipes(fileBuffer);
  await findRecipeMatches(data.recipes);
}

async function saveRecipeData(
  fileName: string,
  imageMapping: { [key: string]: string },
  recipes: RecipeKeeperRecipe[]
) {
  await db.import.create({
    data: {
      fileName: fileName,
      type: "RECIPE_KEEPER",
      status: "PENDING",
      imageMapping: JSON.stringify(imageMapping),
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
      ingredientsTxt: true,
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
    ingredientsTxt: string | null;
  }[]
): boolean {
  const newComparisonKey = recipe.name.concat(recipe.recipeIngredients);
  let highestPercentMatch = 0;
  const secondMatch = existingRecipes.filter((existingRecipe) => {
    const oldComparisonKey = existingRecipe.title.concat(
      existingRecipe.ingredientsTxt as string
    );
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
  for (const file of zipFile.files) {
    if (file.type === "File") {
      const fileMeta = getFileMetaData(file.path);
      if (fileMeta.ext === "html") {
        const htmlData = (await file.buffer()).toString();
        recipeKeeperRecipes = readHTML(htmlData);
      } else if (["jpg", "png", "tiff"].includes(fileMeta.ext)) {
        await processImage(file, imageToHash, fileMeta);
      }
    }
  }
  return {
    recipes: recipeKeeperRecipes,
    images: imageToHash,
  };
}

async function processImage(
  image: ZipFile,
  hashLookup: { [key: string]: string },
  fileMeta: FileMetaData
) {
  // Hash the file
  const hash = crypto.createHash("sha256");
  hash.update(await image.buffer());
  const hashHex = hash.digest("hex");
  const foundImage = await db.photo.findUnique({
    where: { hash: hashHex },
  });
  if (!foundImage) {
    const fileName = `${uuidv4()}.${fileMeta.ext}`;

    await storage.putObject("images", fileName, await image.buffer());

    await db.photo.create({
      data: {
        path: `images/${fileName}`,
        hash: hashHex,
      },
    });
  }
  hashLookup[fileMeta.name] = hashHex;
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
    const fileBuffer = Buffer.from(await (source as File).arrayBuffer());
    return await Open.buffer(fileBuffer);
  }
  throw Error();
}

function getFileMetaData(path: string): FileMetaData {
  if (path) {
    const pathSplit = path.split("/");
    const name = pathSplit.pop() as string; // .pop() only return undefined if the array is empty. Array should not be empty if the string is not empty.
    const ext = getFileExtension(name);

    return {
      path,
      name, //: fileName.replace(fileExt, ""),
      ext,
    };
  }
  throw Error(`Path "${path}" is invalid.`);
}
