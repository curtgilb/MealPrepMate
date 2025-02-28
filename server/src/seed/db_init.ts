import { storage } from "@/infrastructure/object_storage/storage.js";
import { db } from "@/infrastructure/repository/db.js";
import { loadDriRecommendations } from "@/seed/seeders/DriSeeder.js";
import { loadExpirationRules } from "@/seed/seeders/ExpirationRuleSeeder.js";
import { loadGroceryStores } from "@/seed/seeders/GroceryStoreSeeder.js";
import { loadIngredients } from "@/seed/seeders/IngredientSeeder.js";
import { loadNutrients } from "@/seed/seeders/NutrientSeeder.js";
import { loadRecipeMetadata } from "@/seed/seeders/RecipeMetaSeeder.js";
import { loadUnits } from "@/seed/seeders/UnitSeeder.js";

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

export async function seedDb() {
  await loadUnits();
  await loadNutrients();
  await loadDriRecommendations();
  await loadGroceryStores();
  await loadExpirationRules();
  await loadRecipeMetadata();
  await loadIngredients();
  await loadHealthProfile();
}

export async function nukeData() {
  await deleteBuckets();
  await deleteAllRecords();
}

// async function loadMealPlan() {
//   const today = DateTime.now();
//   const nextMonday = today.plus({ days: 1 }).startOf("week").plus({ days: 1 });
//   const mealPlan = await db.mealPlan.create({
//     data: mealPlanCreateStmt,
//     include: { planRecipes: { include: { recipe: true, servings: true } } },
//   });
//   await db.scheduledPlan.create({
//     data: createScheduledInstance(
//       nextMonday,
//       mealPlan.shoppingDays,
//       mealPlan.planRecipes
//     ),
//   });
// }

// // async function loadRecipes() {
// //   const halal = await createHalalChicken();
// //   const gyro = await createChickenGyro();
// //   await db.recipe.updateAggregateLabel(halal.id);
// //   await db.recipe.updateAggregateLabel(gyro.id);
// // }

// async function loadNotificationSettings() {
//   await db.notificationSetting.create({
//     data: {
//       timeZone: "America/Denver",
//     },
//   });
// }

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

// async function loadUnits() {
//   const data = await readCSV("../../data/seed_data/units.csv");
//   await db.measurementUnit.createMany({
//     data: data.map(({ record }) => ({
//       id: record.id,
//       name: record.name,
//       abbreviations: record.lookupNames?.split(", "),
//       symbol: record.symbol ?? undefined,
//       conversionName: record.conversionName,
//       system: record.system
//         ? (record.system.toUpperCase() as MeasurementSystem)
//         : undefined,
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//       type: toMeasurementUnitTypeEnum(record.type),
//     })),
//   });
// }

export async function createBuckets() {
  const buckets = ["imports", "images", "receipts"];
  for (const bucket of buckets) {
    await storage.makeBucket(bucket);
    await storage.setBucketPolicy(bucket, bucketPolicy.replace("$$$", bucket));
  }
}

async function loadHealthProfile() {
  await db.healthProfile.create({
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

// async function loadNutrients() {
//   const nutrients = new NutrientLoader();
//   const stmts = await nutrients.parseNutrients();
//   // Create Nutrients
//   for (const stmt of stmts.createNutrientsStmt) {
//     await db.nutrient.create({ data: stmt });
//   }

//   // Update Stmt for linking child nutrients
//   for (const updateStmt of stmts.updateNutrientsStmt) {
//     await db.nutrient.update(updateStmt);
//   }
//   // Create DRI's
//   const driStmt = await nutrients.parseDRIs();
//   for (const driCreateStmt of driStmt) {
//     await db.dailyReferenceIntake.create({ data: driCreateStmt });
//   }
// }

// async function loadIngredients() {
//   // Load in Ingredients
//   const parser = new IngredientLoader();
//   const expRulesStmt = await parser.parseExpirationRules();
//   await db.expirationRule.createMany({ data: expRulesStmt });
//   const ingredientStmt = await parser.parseIngredients();
//   for (const stmt of ingredientStmt) {
//     await db.ingredient.create({ data: stmt });
//   }
// }

async function deleteAllRecords() {
  const tablenames = await db.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== "_prisma_migrations")
    .map((name) => `"public"."${name}"`)
    .join(", ");

  try {
    await db.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
  } catch (error) {
    console.log(error);
  }
}

// export { deleteAllRecords, deleteBuckets, seedDb, createBuckets };
