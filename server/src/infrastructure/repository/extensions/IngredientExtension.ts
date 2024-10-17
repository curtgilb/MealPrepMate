import { Ingredient, Prisma } from "@prisma/client";
import { searchIngredients } from "@prisma/client/sql";

export const ingredientExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    model: {
      ingredient: {
        async match(search: string): Promise<Ingredient | null> {
          // Check previous matches that have been verified
          const firstAttempt = await client.recipeIngredient.findFirst({
            where: {
              verified: true,
              name: { equals: search, mode: "insensitive" },
            },
            include: { ingredient: true },
          });

          if (firstAttempt) {
            return firstAttempt.ingredient;
          }
          // Search for best match
          else {
            const finalAttempt = await client.$queryRawTyped(
              searchIngredients(search, 1)
            );
            return finalAttempt.length > 0
              ? (finalAttempt[0] as Ingredient)
              : null;
          }
        },
        async search(search: string): Promise<Ingredient[] | null> {
          // Check previous matches that have been verified
          const searchResult = await client.$queryRawTyped(
            searchIngredients(search, 10)
          );
          return searchResult.length > 0
            ? (searchResult as Ingredient[])
            : null;
        },
      },
    },
  });
});
