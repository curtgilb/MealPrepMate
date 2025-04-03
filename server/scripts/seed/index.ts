import { loadDriRecommendations } from "scripts/seed/DriSeeder.js";
import { loadExpirationRules } from "scripts/seed/ExpirationRuleSeeder.js";
import { loadGroceryStores } from "scripts/seed/GroceryStoreSeeder.js";
import { loadUnits } from "scripts/seed/UnitSeeder.js";
import { loadNutrients } from "scripts/seed/NutrientSeeder.js";
import { loadRecipeMetadata } from "scripts/seed/RecipeMetaSeeder.js";
import { loadIngredients } from "scripts/seed/IngredientSeeder.js";
import { db } from "@/infrastructure/repository/db.js";

import { deleteBuckets, createBuckets } from "scripts/seed/BucketStorage.js";

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

export async function seedDb() {
  // Drops all previous records/buckets
  await deleteAllRecords();
  await deleteBuckets();
  await createBuckets();
  await loadUnits();
  await loadNutrients();
  await loadDriRecommendations();
  await loadGroceryStores();
  await loadExpirationRules();
  await loadRecipeMetadata();
  await loadIngredients();
}

await seedDb();
