import { Mutation } from "./generated/graphql";

export const mutations: Mutation = {
  createRecipe: async (parent, args, context) => {
    return await context.db.recipe.create({});
  },
};
