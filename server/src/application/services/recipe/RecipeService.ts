import { Prisma, WebScrapedRecipe } from "@prisma/client";
import { db } from "@/infrastructure/repository/db.js";
import { RecipeScrapingQueue } from "./scrape_recipe/RecipeScrapeJob.js";
import { RecipeFilter } from "@/types/gql.js";

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

async function parseIngredientLines() {}

export { scrapeRecipeFromWeb };
