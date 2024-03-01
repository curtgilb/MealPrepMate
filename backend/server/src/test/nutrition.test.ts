import { NutrientAggregator } from "../services/nutrition/NutrientAggregator2.js";
import { deleteAllRecords, deleteBuckets, seedDb } from "../seed/seed.js";
import { db } from "../db.js";
import { beforeAll, expect, test } from "vitest";
import {
  recipe,
  ingredientGroups,
} from "../../data/test_data/ChickenGyroRecipe.js";

beforeAll(async () => {
  // called once before all tests run
  await seedDb();
  await db.recipeIngredientGroup.createMany({ data: ingredientGroups });
  await db.recipe.create({ data: recipe });

  // clean up function, called once after all tests run
  //   return async () => {
  //     await deleteBuckets();
  //     await deleteAllRecords();
  //   };
});

test("Nutrient Aggregator: recipe with multiple labels", async () => {
  const recipe = await db.recipe.findFirstOrThrow({});
  const aggregator = new NutrientAggregator([recipe.id]);
  await aggregator.aggregateNutrients();
  const nutrientMap = aggregator.getNutrientMap([{ id: recipe.id }]);
  expect(nutrientMap.get("clt6dqtz90000awv9anfb343o")?.value).toBe(2546.67);
  expect(nutrientMap.get("clt6dqtz90000awv9anfb343o")?.valuePerServing).toBe(
    636.67
  );
});
