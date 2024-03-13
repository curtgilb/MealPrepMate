// import { uploadImportFile } from "./services/import/ImportService.js";
// import {
//   LabelMaker,
//   NutrientAggregator,
// } from "./services/nutrition/NutritionAggregator.js";
// import { deleteAllRecords, deleteBuckets, seedDb } from "./seed/seed.js";
import { db } from "./db.js";
import {
  recipe,
  nutritionLabels,
  ingredientGroups,
  ingredients,
} from "../data/test_data/HalalChickenRecipe.js";

import { seedDb } from "./seed/seed.js";

await seedDb();
const recipe1 = await db.recipe.create({ data: recipe });

for (const group of ingredientGroups) {
  await db.recipeIngredientGroup.create({ data: group });
}

for (const label of nutritionLabels) {
  await db.nutritionLabel.create({ data: label });
}

await db.recipeIngredient.createMany({ data: ingredients });

// type RecipeIngredientLife = {
//   id: string;
//   tableLife: number;
//   fridgeLife: number;
//   freezerLife: number;
// };

// const recipeId = "cltdjusyd00sq105upxl2jgt9";

// const rules = await db.$queryRaw<
//   RecipeIngredientLife[]
// >`SELECT recipe_ingredient.id, recipe_ingredient.sentence , expiration_rule."tableLife", expiration_rule."fridgeLife", expiration_rule."freezerLife"
// FROM recipe_ingredient
// INNER JOIN ingredient on recipe_ingredient."ingredientId" = ingredient.id
// INNER JOIN expiration_rule on ingredient."expirationRuleId" = expiration_rule.id
// WHERE recipe_ingredient."recipeId"=${recipeId};`;

// const maxIngredientLife = rules
//   .map((rule) => Math.max(rule.tableLife, rule.freezerLife, rule.fridgeLife))
//   .reduce((min, cur) => {
//     if (cur < min) {
//       return cur;
//     } else {
//       return min;
//     }
//   }, Infinity);

// console.log(rules);

// // await db.recipeIngredientGroup.createMany({ data: halalIngredientGroups });
// // await db.recipe.create({ data: halalChickenRecipe });

// const aggregator = new NutrientAggregator([recipe1.id]);
// await aggregator.aggregateNutrients();
// const nutrientMap = aggregator.getNutrientMap([
//   { id: recipe1.id, factor: 1.5, totalServings: 9 },
// ]);

// const labelMaker = new LabelMaker();
// const label = await labelMaker.createLabel({
//   nutrients: nutrientMap,
//   servings: {
//     servings: 9,
//   },
//   advanced: true,
// });

// for (let i = 0; i < 100; i++) {
//   console.log(cuid());
// }
