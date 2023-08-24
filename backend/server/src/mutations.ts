import { Resolvers } from "./generated/graphql";
import { tagIngredients } from "./ingredientTagger";
import { toTitleCase } from "./util/utils";
import { RecipeInput } from "./generated/graphql";
import { compareIngredients, createRecipeIngredients } from "./services/Recipe";
import { Prisma } from "@prisma/client";

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
    updateRecipe: async (parent, args, context) => {
      const recipe: Prisma.RecipeUpdateInput = {
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
          set: args.recipe.category.map((id) => ({ id: id })),
        },
        cuisine: {
          update: {
            id: args.recipe.cuisine,
          },
        },
      };
      if (args.recipe.ingredients !== undefined) {
        const ingredientsComparison = await compareIngredients(
          context.db,
          args.id,
          args.recipe.ingredients
        );
        recipe.isVerified = !ingredientsComparison.changed;

        if (ingredientsComparison.changed) {
          recipe.ingredients = {};
          if (ingredientsComparison.added.length > 0) {
            recipe.ingredients.create = ingredientsComparison.added;
          }
          if (ingredientsComparison.deleted.length > 0) {
            recipe.ingredients.delete = ingredientsComparison.deleted.map(
              (id) => ({ id: id })
            );
          }
        }
      }
      return context.db.recipe.update({
        where: { id: args.id },
        data: recipe,
        include: {
          ingredients: true,
        },
      });
    },
    deleteRecipe: async (parent, args, context) => {
      await context.db.recipeIngredient.delete({
        where: { id: args.id },
      });
      return true;
    },
  },
};
