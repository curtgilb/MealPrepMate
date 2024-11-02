import { Queue, Worker } from "bullmq";
import { db } from "../../../infrastructure/db.js";
import { WebParsedRecord } from "../../import/parsers/RecipeScraper.js";
import { RecipeInputValidation } from "../../../validations/RecipeValidation.js";
import { createNutritionLabelValidation } from "../../../validations/NutritionValidation.js";
import { createRecipeCreateStmt } from "../../../domain/extensions/RecipeExtension.js";
import { IngredientMatcher } from "../../../domain/extensions/IngredientMatcher.js";
import { connection } from "../../../infrastructure/Redis.js";

type WebScrapingJob = {
  url: string;
};

const RecipeScrapingQueue = new Queue<WebScrapingJob>(
  "recipe_scrapes",
  connection
);

const worker = new Worker(
  "recipe_scrapes",
  // eslint-disable-next-line @typescript-eslint/require-await
  async (job) => {
    const url = (job.data as WebScrapingJob).url;
    const parser = new WebParsedRecord(url);
    const recipe = await parser.transform(RecipeInputValidation);
    const label = await parser.toNutritionLabel(createNutritionLabelValidation);
    const createStmt = await createRecipeCreateStmt({
      recipe,
      nutritionLabel: label,
      verified: false,
      ingredientMatcher: new IngredientMatcher(),
      update: false,
    });

    const createdRecipe = await db.recipe.create({ data: createStmt });
    await db.webScrapedRecipe.update({
      where: { id: job.id },
      data: { scraped: true, recipe: { connect: { id: createdRecipe.id } } },
    });
  },
  connection
);

worker.on("failed", (job, err) => {
  db.webScrapedRecipe
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    .update({ where: { id: job?.id }, data: { scraped: true } })
    .catch((err) => {
      console.log(err);
    });
});

export { RecipeScrapingQueue };
