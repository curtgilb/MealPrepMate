import { Resolvers } from "./generated/graphql";
import { tagIngredients } from "./ingredientTagger";
import { toTitleCase } from "./util/utils";
import { RecipeInput } from "./generated/graphql";
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
          connect: args.recipe.category.map((id) => ({ id: id })),
        },
        collection: {
          connect: args.recipe.collection.map((id) => ({ id: id })),
        },
      };

      if (
        "ingredients" in args.recipe &&
        args.recipe.ingredients !== undefined
      ) {
        const taggedIngredients = await tagIngredients(args.recipe.ingredients);
        for (const ingredient of taggedIngredients) {
          const match = await context.db.ingredient.findFirst({
            where: {
              OR: [
                {
                  primaryName: {
                    contains: ingredient.name,
                    mode: "insensitive",
                  },
                },
                {
                  alternateNames: {
                    some: {
                      name: { contains: ingredient.name, mode: "insensitive" },
                    },
                  },
                },
              ],
            },
          });
          if (match !== null) {
            ingredient.ingredient = { connect: { id: match.id } };
          }
          recipe["ingredients"] = { create: taggedIngredients };
        }

        return await context.db.recipe.create({ data: recipe });
      }
    },
  },
};
