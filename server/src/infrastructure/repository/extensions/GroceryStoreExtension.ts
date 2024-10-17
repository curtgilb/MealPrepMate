import { GroceryStore, Prisma } from "@prisma/client";
import { matchGroceryStore } from "@prisma/client/sql";

export const ingredientExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    model: {
      groceryStore: {
        async match(search: string): Promise<GroceryStore | null> {
          const searchResult = await client.$queryRawTyped(
            matchGroceryStore(search, 1)
          );

          return searchResult.length > 0
            ? (searchResult[0] as GroceryStore)
            : null;
        },
      },
    },
  });
});
