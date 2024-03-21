import { createHalalChicken } from "../data/test_data/HalalChickenRecipe.js";
import { createChickenGyro } from "../data/test_data/ChickenGyroRecipe.js";

import { seedDb } from "./seed/seed.js";
import { mealPlanCreateStmt } from "../data/test_data/MealPlan.js";
import { db } from "./db.js";

await seedDb();
// const result = await db.recipeIngredient.groupBy({ by: ["ingredientId"] });
// console.log(result);
