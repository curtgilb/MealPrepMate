import { PrismaClient } from "@prisma/client";
import { toTitleCase } from "../util/utils";
import { readCSV } from "./Readers";
import { Transformer } from "./Transformer";
const prisma = new PrismaClient();

(async () => {
  // await loadIngredients();
  await loadNutrients();

  // const nutrients = await readCSV("../data/nutrients.csv", (value) =>
  //   transformer.toNutrient(value)
  // );
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

async function loadNutrients() {
  // Load in Nutrients
  const transformer = new Transformer();
  const nutrients = await readCSV("../../data/nutrients.csv");
  const mineralDRI = await readCSV("../../data/FDA/minerals.csv");
  const vitaminDRI = await readCSV("../../data/FDA/vitamins.csv");
  const dris = [...mineralDRI, ...vitaminDRI];
  const records = await prisma.nutrient.createMany({
    data: transformer.toNutrientAndDRI(nutrients, dris),
  });

  // Create self-references for nutrients

  console.log("End");
}

async function loadIngredients() {
  // Load in Ingredients
  const transformer = new Transformer();
  const ingredients = await readCSV("../../data/Ingredients.csv");
  // for (const ingredient of ingredients) {
  await prisma.ingredient.createMany({
    data: ingredients.map((ingredient) => transformer.toIngredient(ingredient)),
    skipDuplicates: true,
  });
  // }
}
