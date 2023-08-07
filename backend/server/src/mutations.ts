import { Resolvers } from "./generated/graphql";
import { tagIngredients } from "./ingredientTagger";
import { toTitleCase } from "./util/casing";
import { Category, Collection, PrismaClient } from "@prisma/client";

async function findOrCreate(
  db: PrismaClient,
  items: string[],
  model: string
): Promise<string[]> {
  const ids: string[] = [];
  let result: Collection | Category;
  for (const item of items) {
    const name = item.toLowerCase();
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      result = await db[model].findUniqueOrThrow({
        where: { name: name },
      });
    } catch (error) {
      console.log(error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      result = await db[model].create({
        data: { name: name },
      });
    }
    ids.push(result.id);
  }
  return ids;
}

export const mutations: Resolvers = {
  Mutation: {
    createRecipe: async (parent, args, context) => {
      const relatedCategories = await findOrCreate(
        context.db,
        args.recipe.category,
        "category"
      );
      const relatedCollections = await findOrCreate(
        context.db,
        args.recipe.collection,
        "collection"
      );
      const recipe = {
        title: toTitleCase(args.recipe.title),
        servings: args.recipe.servings,
        source: args.recipe.source,
        preparationTime: args.recipe.preparationTime,
        cookingTime: args.recipe.cookingTime,
        directions: args.recipe.directions,
        notes: args.recipe.notes,
        stars: args.recipe.stars,
        isFavorite: args.recipe.isFavorite,
        course: args.recipe.course,
        category: {
          connect: relatedCategories.map((id) => ({ id: id })),
        },
        collections: {
          connect: relatedCollections.map((id) => ({ id: id })),
        },
      };
      if ("ingredients" in args.recipe) {
        recipe["ingredients"] = await tagIngredients(args.recipe.ingredients);
      }

      return await context.db.recipe.create({
        data: recipe,
      });
    },
  },
};
