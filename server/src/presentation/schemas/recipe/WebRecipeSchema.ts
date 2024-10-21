import { z } from "zod";
import { db } from "@/infrastructure/repository/db.js";
import { scrapeRecipeFromWeb } from "@/features/recipe/RecipeService.js";
import { builder } from "@/presentation/builder.js";

builder.prismaObject("WebScrapedRecipe", {
  fields: (t) => ({
    id: t.exposeString("id"),
    url: t.exposeString("url"),
    isBookmark: t.exposeBoolean("isBookmark"),
    created: t.field({ type: "DateTime", resolve: (parent) => parent.created }),
    recipe: t.relation("recipe"),
  }),
});

builder.queryFields((t) => ({
  bookmarkedRecipes: t.prismaField({
    type: ["WebScrapedRecipe"],
    resolve: async (query) => {
      // @ts-ignore
      return await db.webScrapedRecipe.findMany({ ...query });
    },
  }),
}));

builder.mutationFields((t) => ({
  scrapeRecipe: t.prismaField({
    type: "WebScrapedRecipe",
    args: {
      url: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args) => {
      return await scrapeRecipeFromWeb(args.url, false, query);
    },
  }),
  saveBookmark: t.prismaField({
    type: "WebScrapedRecipe",
    args: {
      url: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args) => {
      return await scrapeRecipeFromWeb(args.url, true, query);
    },
  }),
}));
