import { PrismaClient } from "@prisma/client";
import { readCSV } from "../services/io/Readers.js";

import { storage } from "../storage.js";
import { cast, toMeasurementUnitTypeEnum } from "../util/Cast.js";
const prisma = new PrismaClient();
import { db } from "../db.js";
import { NutrientParser } from "../services/parsers/NutrientParser.js";
import { IngredientParser } from "../services/parsers/IngredientParser.js";
const bucketPolicy =
  '{"Version":"2012-10-17","Statement":[{"Sid":"PublicReadGetObject","Effect":"Allow","Principal":"*","Action":["s3:GetObject"],"Resource":["arn:aws:s3:::$$$/*"]}]}';

// Units first
// Nutrients
// Ingredients
// Recipes

(async () => {
  await deleteAllRecords();
  await deleteBuckets();
  await createBuckets();
  await loadUnits();
  await loadCourses();
  await loadCateogries();
  await loadCuisines();
  await loadNutrients();
  await loadIngredients();

  // await loadRecipes();
  await loadHealthProfile();
})()
  .then(() => {
    console.log("Seeding complete");
  })
  .catch((error) => {
    console.error(error);
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await prisma.$disconnect();
  });

async function deleteBuckets() {
  const buckets = await storage.listBuckets();
  for (const bucket of buckets) {
    const objectsToDelete: string[] = [];
    const stream = storage.listObjectsV2(bucket.name, "", true);
    stream.on("data", (object) => {
      objectsToDelete.push(object.name as string);
    });
    stream.on("end", () => {
      storage.removeObjects(bucket.name, objectsToDelete, (error) => {
        if (error) console.log(error);
        storage.removeBucket(bucket.name, (error) => {
          if (error) console.log(error);
        });
      });
    });
  }
}

async function loadUnits() {
  const data = await readCSV("../../../data/seed_data/units.csv");
  await db.measurementUnit.createMany({
    data: data.map(({ record }) => ({
      name: cast(record.name) as string,
      abbreviations: record.lookupNames?.split(", "),
      symbol: cast(record.symbol) as string,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      type: toMeasurementUnitTypeEnum(record.type),
    })),
  });
}

async function createBuckets() {
  const buckets = ["imports", "images"];
  for (const bucket of buckets) {
    await storage.makeBucket(bucket);
    await storage.setBucketPolicy(bucket, bucketPolicy.replace("$$$", bucket));
  }
}

async function loadHealthProfile() {
  await prisma.healthProfile.create({
    data: {
      weight: 180,
      gender: "MALE",
      bodyFatPercentage: 0.25,
      height: 72,
      yearBorn: 1994,
      activityLevel: 1.2,
      // targ: 0.25,
      // targetCarbs: 0.5,
      // targetFat: 0.5,
    },
  });
}

async function loadCateogries() {
  await prisma.category.createMany({
    data: [
      { name: "Main Dish" },
      { name: "Side Dish" },
      { name: "Dessert" },
      { name: "Appetizer" },
      { name: "Salad" },
      { name: "Bread" },
      { name: "Soup" },
      { name: "Beverage" },
      { name: "Sauce/Dressing" },
    ],
  });
}

async function loadCourses() {
  await prisma.course.createMany({
    data: [
      { name: "Breakfast" },
      { name: "Lunch" },
      { name: "Dinner" },
      { name: "Snack" },
    ],
  });
}

async function loadCuisines() {
  await prisma.cuisine.createMany({
    data: [
      { name: "Italian" },
      { name: "Chinese" },
      { name: "Japanese" },
      { name: "Mexican" },
      { name: "Indian" },
      { name: "French" },
      { name: "Spanish" },
      { name: "Thai" },
      { name: "Mediterranean" },
      { name: "Middle Eastern" },
      { name: "Korean" },
      { name: "Vietnamese" },
      { name: "Greek" },
      { name: "American" },
      { name: "Brazilian" },
    ],
  });
}

async function loadNutrients() {
  const nutrients = new NutrientParser();
  const stmts = await nutrients.parse();
  await db.nutrient.createMany({ data: stmts.createNutrientsStmt });

  for (const driCreateStmt of stmts.dri) {
    await db.dailyReferenceIntake.create({ data: driCreateStmt });
  }

  for (const updateStmt of stmts.updateNutrientsStmt) {
    await db.nutrient.update(updateStmt);
  }
}

async function loadIngredients() {
  // Load in Ingredients
  const parser = new IngredientParser();
  const expRulesStmt = await parser.parseExpirationRules();
  const categoriesStmt = await parser.parseIngredientCategories();
  await db.expirationRule.createMany({ data: expRulesStmt });
  await db.category.createMany({ data: categoriesStmt, skipDuplicates: true });
  const ingredientStmt = await parser.parseIngredients(
    await db.expirationRule.findMany({}),
    await db.category.findMany({})
  );
  await db.ingredient.createMany({ data: ingredientStmt });
}

export async function deleteAllRecords() {
  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== "_prisma_migrations")
    .map((name) => `"public"."${name}"`)
    .join(", ");

  try {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
  } catch (error) {
    console.log(error);
  }
}

// async function loadRecipes() {
//   const recipes = readHTML("../../data/RecipeKeeper/recipes.html");
//   const createStmts = await toRecipeCreateInputFromRecipeKeeper(
//     prisma,
//     recipes
//   );

//   for (const createStmt of createStmts) {
//     await prisma.recipe.create({
//       data: createStmt,
//     });
//   }
// }
