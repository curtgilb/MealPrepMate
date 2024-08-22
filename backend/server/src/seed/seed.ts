import { MeasurementSystem, PrismaClient } from "@prisma/client";
import { DateTime } from "luxon";
import { createChickenGyro } from "../../data/test_data/ChickenGyroRecipe.js";
import { createHalalChicken } from "../../data/test_data/HalalChickenRecipe.js";
import {
  createScheduledInstance,
  mealPlanCreateStmt,
} from "../../data/test_data/MealPlan.js";
import { db } from "../db.js";
// import { RecipeKeeperImport } from "../services/import/importers/RecipeKeeperImport.js";
import { readCSV } from "../services/io/Readers.js";
import { storage } from "../storage.js";
import { toMeasurementUnitTypeEnum } from "../util/Cast.js";
import { IngredientLoader } from "./dataloaders/IngredientParser.js";
import { NutrientLoader } from "./dataloaders/NutrientParser.js";
const prisma = new PrismaClient();
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
  await loadCategories();
  await loadCuisines();
  await loadNutrients();
  await loadIngredients();
  await loadHealthProfile();
  await loadNotificationSettings();
  await loadRecipes();
  await loadMealPlan();
  // await loadImport();
  await loadGroceryStores();

  console.log("Seeding complete");
  await prisma.$disconnect();
}

// async function loadImport() {
//   const recipeKeeperImport = await db.import.create({
//     data: {
//       fileName: "RecipeKeeper.zip",
//       type: "RECIPE_KEEPER",
//       status: "PENDING",
//       storagePath: "somewhere",
//     },
//   });
//   const importer = new RecipeKeeperImport({
//     source: "../../../data/RecipeKeeper.zip",
//     import: recipeKeeperImport,
//   });
//   await importer.processImport();
// }

async function loadGroceryStores() {
  await db.groceryStore.createMany({
    data: [
      { name: "Walmart" },
      { name: "Kroger" },
      { name: "Albertsons" },
      { name: "Costco" },
      { name: "Publix" },
      { name: "Safeway" },
      { name: "Whole Foods Market" },
      { name: "Trader Joe's" },
      { name: "H-E-B" },
      { name: "Meijer" },
      { name: "Target" },
      { name: "Aldi" },
      { name: "Sam's Club" },
      { name: "Giant Eagle" },
      { name: "WinCo" },
      { name: "Hy-Vee" },
      { name: "Wegmans" },
      { name: "Food Lion" },
      { name: "ShopRite" },
      { name: "Stop & Shop" },
      { name: "Sprouts Farmers Market" },
      { name: "Piggly Wiggly" },
      { name: "Ralphs" },
      { name: "Fred Meyer" },
      { name: "Food 4 Less" },
      { name: "Harris Teeter" },
      { name: "Giant Food" },
      { name: "Bi-Lo" },
      { name: "Jewel-Osco" },
      { name: "Vons" },
      { name: "Shaw's" },
      { name: "Ingles Markets" },
      { name: "Fry's Food Stores" },
      { name: "Market Basket" },
      { name: "Raley's" },
      { name: "QFC (Quality Food Centers)" },
      { name: "Woodman's Markets" },
      { name: "Price Chopper" },
      { name: "King Soopers" },
      { name: "The Fresh Market" },
      { name: "Acme Markets" },
      { name: "Brookshire Grocery Company" },
      { name: "Food City" },
      { name: "Stater Bros. Markets" },
      { name: "SpartanNash" },
      { name: "Super 1 Foods" },
      { name: "Tops Friendly Markets" },
      { name: "Associated Food Stores" },
      { name: "Weis Markets" },
      { name: "Smart & Final" },
      { name: "Coborn's" },
      { name: "United Supermarkets" },
      { name: "Save Mart Supermarkets" },
      { name: "Buehler's Fresh Foods" },
      { name: "Fareway Stores" },
      { name: "Food Basics USA" },
      { name: "Key Food Stores Co-Operative Inc." },
      { name: "Food Bazaar Supermarket" },
      { name: "Lidl" },
      { name: "FoodMaxx" },
      { name: "Foodtown" },
      { name: "Marc's Stores" },
      { name: "Shoppers Food & Pharmacy" },
      { name: "Rouses Markets" },
      { name: "El Super" },
      { name: "Cardenas Markets" },
      { name: "Vallarta Supermarkets" },
      { name: "Northgate Market" },
      { name: "Pueblo Supermarkets" },
      { name: "WinCo Foods" },
      { name: "Cash Wise Foods" },
      { name: "Festival Foods" },
      { name: "Supermercado Nuestra Familia" },
      { name: "Homeland Stores" },
      { name: "Western Beef" },
      { name: "Foodarama" },
      { name: "Ramey's Marketplace" },
      { name: "Grocery Outlet Bargain Market" },
      { name: "United Grocery Outlet" },
      { name: "Reasor's" },
      { name: "Lowes Foods" },
      { name: "Dan's Supermarket" },
      { name: "Macey's" },
      { name: "Smith's Food and Drug" },
      { name: "Dillons" },
      { name: "Market 32" },
      { name: "Bel Air Markets" },
      { name: "Gelson's Markets" },
      { name: "Lunds & Byerlys" },
      { name: "Nugget Markets" },
      { name: "Metropolitan Market" },
      { name: "New Seasons Market" },
      { name: "Earth Fare" },
      { name: "Fresh Thyme Farmers Market" },
      { name: "The Market at Wegmans" },
      { name: "Basha's" },
      { name: "Harmon's Grocery" },
      { name: "Heinen's Grocery Store" },
      { name: "Houchens Industries" },
    ],
  });
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
  const halal = await createHalalChicken();
  const gyro = await createChickenGyro();
  await db.recipe.updateAggregateLabel(halal.id);
  await db.recipe.updateAggregateLabel(gyro.id);
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
      conversionName: record.conversionName,
      system: record.system
        ? (record.system.toUpperCase() as MeasurementSystem)
        : undefined,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      type: toMeasurementUnitTypeEnum(record.type),
    })),
  });
}

async function createBuckets() {
  const buckets = ["imports", "images", "receipts"];
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
    },
  });
}

async function loadCategories() {
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

export { deleteAllRecords, deleteBuckets, seedDb };
