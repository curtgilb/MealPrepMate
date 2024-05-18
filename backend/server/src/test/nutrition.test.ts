import { deleteAllRecords, deleteBuckets, seedDb } from "../seed/seed.js";
import { db } from "../db.js";
import { beforeAll, expect, test } from "vitest";
import { LabelAggregator } from "../services/nutrition/LabelAggregator.js";

// beforeAll(async () => {
//   // called once before all tests run
//   await seedDb();

//   // clean up function, called once after all tests run
//   return async () => {
//     await deleteBuckets();
//     await deleteAllRecords();
//   };
// });

test("Group and aggregate nutrients in recipe", async () => {
  const halalChicken = new LabelAggregator("cltp0k2yi000008la6ybr3shp");
  const nutrients = await halalChicken.getNutrientTotals();

  expect(nutrients?.get("clt6dqtz90000awv9anfb343o")?.total).toBe(563.11);
});

// test("Nutrient Aggregator: recipe with multiple labels", async () => {
//   const recipe = await db.recipe.findFirstOrThrow({});
//   const aggregator = new NutrientAggregator([recipe.id]);
//   await aggregator.aggregateNutrients();
//   const nutrientMap = aggregator.getNutrientMap([{ id: recipe.id }]);
//   // Check Calories
//   const calories = nutrientMap.get("clt6dqtz90000awv9anfb343o");
//   expect(calories?.value.toFixed(2)).toBe("2546.67");
//   expect(calories?.valuePerServing.toFixed(2)).toBe("424.45");

//   // Check fiber
//   const fiber = nutrientMap.get("clt6dqtzc0008awv91e2h8zwj");
//   expect(fiber?.value.toFixed(2)).toBe("44.42");
//   expect(fiber?.valuePerServing.toFixed(2)).toBe("7.40");

//   // Check total fat
//   const fat = nutrientMap.get("clt6dqtze000lawv9b3w34hxe");
//   expect(fat?.value.toFixed(2)).toBe("91.97");
//   expect(fat?.valuePerServing.toFixed(2)).toBe("15.33");
// });

// test("Nutrient Aggregator: scaled recipe", async () => {
//   const recipe = await db.recipe.findFirstOrThrow({});
//   const aggregator = new NutrientAggregator();
//   await aggregator.addLabels([recipe.id]);
//   const nutrientMap = aggregator.getNutrientMap([
//     { id: recipe.id, factor: 1.5, totalServings: 9 },
//   ]);

//   const vitA = nutrientMap.get("clt6dqtzm001nawv940jw0v1l");
//   expect(vitA?.value.toFixed(2)).toBe("418.15");
//   expect(vitA?.valuePerServing.toFixed(2)).toBe("46.46");

//   const carbs = nutrientMap.get("clt6dqtzc0007awv9h1mv5pbi");
//   expect(carbs?.value.toFixed(2)).toBe("404.41");
//   expect(carbs?.valuePerServing.toFixed(2)).toBe("44.93");

//   const phenylalanine = nutrientMap.get("clt6dqtzj0017awv92fwrajtd");
//   expect(phenylalanine?.value.toFixed(2)).toBe("0.97");
//   expect(phenylalanine?.valuePerServing.toFixed(2)).toBe("0.11");
// });

// test("Nutrient Aggregator: aggregated nutrients multiple labels", async () => {
//   const recipes = await db.recipe.findMany({ orderBy: { name: "asc" } });
//   const aggregator = new NutrientAggregator();
//   await aggregator.addLabels(recipes.map((recipe) => recipe.id));
//   const nutrientMap = aggregator.getNutrientMap([
//     { id: recipes[0].id, factor: 1.5, totalServings: 9 },
//     { id: recipes[1].id, factor: 1.5, totalServings: 8, servingsUsed: 3 },
//   ]);

//   const calories = nutrientMap.get("clt6dqtz90000awv9anfb343o");
//   expect(calories?.value.toFixed(2)).toBe("4136.75");

//   const carbs = nutrientMap.get("clt6dqtzc0007awv9h1mv5pbi");
//   expect(carbs?.value.toFixed(2)).toBe("428.16");

//   const protein = nutrientMap.get("clt6dqtzg000uawv918m4fxsm");
//   expect(protein?.value.toFixed(2)).toBe("272.10");
// });
