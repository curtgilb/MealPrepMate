import { PrismaClient } from "@prisma/client";
import { readCSV } from "../services/io/Readers.js";
import { storage } from "../storage.js";
import { toMeasurementUnitTypeEnum } from "../util/Cast.js";
const prisma = new PrismaClient();
import { NutrientLoader } from "./dataloaders/NutrientParser.js";
import { IngredientLoader } from "./dataloaders/IngredientParser.js";
import { db } from "../db.js";
import { createHalalChicken } from "../../data/test_data/HalalChickenRecipe.js";
import { createChickenGyro } from "../../data/test_data/ChickenGyroRecipe.js";
import {
  createScheduledInstance,
  mealPlanCreateStmt,
} from "../../data/test_data/MealPlan.js";
import { DateTime } from "luxon";
const bucketPolicy = `{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": [
                    "*"
                ]
            },
            "Action": [
                "s3:GetObject"
            ],
            "Resource": [
                "arn:aws:s3:::$$$/*"
            ]
        }
    ]
}`;

async function seedDb() {
  await deleteAllRecords();
  await deleteBuckets();
  await createBuckets();
  await loadUnits();
  await loadCourses();
  await loadCateogries();
  await loadCuisines();
  await loadNutrients();
  await loadIngredients();
  await loadHealthProfile();
  await loadNotificationSettings();
  await loadRecipes();
  await loadMealPlan();

  console.log("Seeding complete");
  await prisma.$disconnect();
}

async function loadMealPlan() {
  const today = DateTime.now();
  const nextMonday = today.plus({ days: 1 }).startOf("week").plus({ days: 1 });
  const mealPlan = await db.mealPlan.create({
    data: mealPlanCreateStmt,
    include: { planRecipes: { include: { recipe: true, servings: true } } },
  });
  await db.scheduledPlan.create({
    data: createScheduledInstance(
      nextMonday,
      mealPlan.shoppingDays,
      mealPlan.planRecipes
    ),
  });
}

async function loadRecipes() {
  await createHalalChicken();
  await createChickenGyro();
}

async function loadNotificationSettings() {
  await db.notificationSetting.create({
    data: {
      timeZone: "America/Denver",
    },
  });
}

async function deleteBuckets() {
  const buckets = await storage.listBuckets();
  const promises: Promise<string[]>[] = [];

  for (const bucket of buckets) {
    promises.push(
      new Promise((resolve, reject) => {
        const bucketObjects: string[] = [];
        const stream = storage.listObjectsV2(bucket.name, "", true);
        stream.on("data", function (obj) {
          if (obj.name) bucketObjects.push(obj.name);
          console.log(obj);
        });
        stream.on("end", () => {
          resolve(bucketObjects);
        });

        stream.on("error", (err) => reject(err));
      })
    );
  }
  const files = await Promise.all(promises);
  for (const [i, file] of files.entries()) {
    await storage.removeObjects(buckets[i].name, file);
    await storage.removeBucket(buckets[i].name);
  }
}

async function loadUnits() {
  const data = await readCSV("../../../data/seed_data/units.csv");
  await db.measurementUnit.createMany({
    data: data.map(({ record }) => ({
      id: record.id,
      name: record.name,
      abbreviations: record.lookupNames?.split(", "),
      symbol: record.symbol ?? undefined,
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
      specialCondition: "NONE",
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
  const nutrients = new NutrientLoader();
  const stmts = await nutrients.parseNutrients();
  // Create Nutrients
  for (const stmt of stmts.createNutrientsStmt) {
    await db.nutrient.create({ data: stmt });
  }

  // Update Stmt for linking child nutrients
  for (const updateStmt of stmts.updateNutrientsStmt) {
    await db.nutrient.update(updateStmt);
  }
  // Create DRI's
  const driStmt = await nutrients.parseDRIs();
  for (const driCreateStmt of driStmt) {
    await db.dailyReferenceIntake.create({ data: driCreateStmt });
  }
}

async function loadIngredients() {
  // Load in Ingredients
  const parser = new IngredientLoader();
  const expRulesStmt = await parser.parseExpirationRules();
  await db.expirationRule.createMany({ data: expRulesStmt });
  const ingredientStmt = await parser.parseIngredients();
  for (const stmt of ingredientStmt) {
    await db.ingredient.create({ data: stmt });
  }
}

async function deleteAllRecords() {
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

export { seedDb, deleteAllRecords, deleteBuckets };
