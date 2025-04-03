import { loadHealthProfile } from "scripts/test/HealthProfile.js";
import { loadRecipes } from "scripts/test/Recipes.js";

async function loadTestData() {
  await loadHealthProfile();
  await loadRecipes();
  // await load IngredientPrices();
}

await loadTestData();
