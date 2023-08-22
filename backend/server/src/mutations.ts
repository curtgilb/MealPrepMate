import { Resolvers } from "./generated/graphql";
import { tagIngredients } from "./ingredientTagger";
import { toTitleCase } from "./util/utils";
import { RecipeInput } from "./generated/graphql";
import { createRecipeIngredients } from "./services/Recipe";
import { Prisma } from "@prisma/client";
// import { Category, Collection, Recipe, PrismaClient } from "@prisma/client";

// async function findOrCreate(
//   db: PrismaClient,
//   items: string[],
//   model: string
// ): Promise<string[]> {
//   const ids: string[] = [];
//   let result: Collection | Category;
//   for (const item of items) {
//     const name = item.toLowerCase();
//     try {
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
//       result = await db[model].findUniqueOrThrow({
//         where: { name: name },
//       });
//     } catch (error) {
//       console.log(error);
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
//       result = await db[model].create({
//         data: { name: name },
//       });
//     }
//     ids.push(result.id);
//   }
//   return ids;
// }

export const mutations: Resolvers = {
  Mutation: {
    createRecipe: async (parent, args, context) => {
      // When a recipe is created, the ingredients are parsed, tentitive matches are made with ingredients.
      // A different mutation will update/verify the matches.
      const recipe: Prisma.RecipeCreateInput = {
        title: toTitleCase(args.recipe.title),
        servings: args.recipe.servings,
        source: args.recipe.source,
        preparationTime: args.recipe.preparationTime,
        cookingTime: args.recipe.cookingTime,
        directions: args.recipe.directions,
        notes: args.recipe.notes,
        stars: args.recipe.stars,
        isFavorite: args.recipe.isFavorite,
        ingredientsTxt: args.recipe.ingredients,
        course: { connect: { id: args.recipe.course } },
        category: {
          connect: args.recipe.category.map((id) => ({ id: id })),
        },
        cuisine: {
          connect: {
            id: args.recipe.cuisine,
          },
        },
      };
      if (args.recipe.ingredients !== undefined) {
        recipe.ingredients = {
          create: await createRecipeIngredients(
            context.db,
            args.recipe.ingredients
          ),
        };
      }
      return context.db.recipe.create({ data: recipe });
    },
  },
};
