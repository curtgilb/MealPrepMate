import { Resolvers } from "./generated/graphql";
import { tagIngredients } from "./ingredientTagger";

export const resolvers: Resolvers = {
  Query: {
    recipe: async (parent, args, context) => {
      return await context.db.recipe.findUnique({
        where: { id: args.id },
      });
    },
    recipes: async (parent, args, context) => {
      return await context.db.recipe.findMany({
        where: {
          AND: [
            { title: { contains: args.filters.title, mode: "insensitive" } },
            { source: { contains: args.filters.source, mode: "insensitive" } },
            { preparationTime: { lte: args.filters.preparationTime } },
            { servings: { gte: args.filters.servings } },
            { isFavorite: { equals: args.filters.isFavorite } },
            { course: { equals: args.filters.course } },
            {
              collection: {
                some: { name: { in: args.filters.collection } },
              },
            },
            {
              category: {
                some: { name: { in: args.filters.category } },
              },
            },
            {
              ingredients: {
                some: {
                  OR: [
                    {
                      ingredient: {
                        primaryName: {
                          in: args.filters.ingredients,
                          mode: "insensitive",
                        },
                      },
                    },
                    {
                      ingredient: {
                        alternateNames: {
                          some: {
                            name: {
                              in: args.filters.ingredients,
                              mode: "insensitive",
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      });
    },
    categories: async (parent, args, context) => {
      const result = await context.db.category.findMany({
        where: {
          name: { contains: args.name, mode: "insensitive" },
        },
        select: {
          name: true,
        },
      });
      return result.map((category) => category.name);
    },
    collections: async (parent, args, context) => {
      const result = await context.db.collection.findMany({
        where: {
          name: { contains: args.name, mode: "insensitive" },
        },
        select: {
          name: true,
        },
      });
      return result.map((collection) => collection.name);
    },
    ingredients: async (parent, args, context) => {
      const result = await context.db.ingredient.findMany({
        where: {
          OR: [
            { primaryName: { contains: args.name, mode: "insensitive" } },
            {
              alternateNames: {
                some: { name: { contains: args.name, mode: "insensitive" } },
              },
            },
          ],
        },
      });
      return result;
    },
    parseIngredient: async (parent, args, context) => {
      return await tagIngredients(args.sentance);
    },
  },
};
