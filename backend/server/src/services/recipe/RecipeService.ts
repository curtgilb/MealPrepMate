import {
  FullNutritionLabel,
  NutrientMapArgs,
} from "../nutrition/NutritionAggregator.js";
import {
  LabelMaker,
  NutrientAggregator,
} from "../../services/nutrition/NutritionAggregator.js";
import { Prisma, WebScrapedRecipe } from "@prisma/client";
import { db } from "../../db.js";
import { RecipeScrapingQueue } from "./scrape_recipe/RecipeScrapeJob.js";

type WebRecipeQuery = {
  include?: Prisma.WebScrapedRecipeInclude | undefined;
  select?: Prisma.WebScrapedRecipeSelect | undefined;
};

async function scrapeRecipeFromWeb(
  url: string,
  isBookmark: boolean,
  query?: WebRecipeQuery
): Promise<WebScrapedRecipe> {
  const bookmark = await db.webScrapedRecipe.create({
    data: { url, isBookmark },
    ...query,
  });
  await RecipeScrapingQueue.add(bookmark.id, { url: url });
  return bookmark;
}

async function getAggregatedLabel(
  recipes: NutrientMapArgs[], // Recipe ID
  advanced: boolean,
  groupByLabel: boolean
): Promise<FullNutritionLabel> {
  const aggregator = new NutrientAggregator();
  await aggregator.addLabels(
    recipes.map((recipe) => recipe.id),
    groupByLabel
  );

  const nutrients = aggregator.getNutrientMap(recipes);
  const servingInfo =
    recipes.length === 1
      ? {
          ...aggregator.getServingInfo(recipes[0].id),
          ...recipes[0]?.scale,
        }
      : {};
  const labelMaker = new LabelMaker();
  return labelMaker.createLabel({ nutrients, servings: servingInfo, advanced });
}

export { getAggregatedLabel, scrapeRecipeFromWeb };
