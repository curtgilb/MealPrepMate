import { db } from "@/infrastructure/repository/db.js";
import { Prisma } from "@prisma/client";

type GroceryStoreQuery = {
  include?: Prisma.GroceryStoreInclude | undefined;
  select?: Prisma.GroceryStoreSelect | undefined;
};

async function getGroceryStores(search?: string, query?: GroceryStoreQuery) {
  return await db.groceryStore.findMany({
    where: {
      name: { contains: search ?? undefined, mode: "insensitive" },
    },
    orderBy: { name: "asc" },
    ...query,
  });
}

async function createGroceryStore(name: string, query?: GroceryStoreQuery) {
  return await db.groceryStore.create({
    // @ts-ignore
    data: { name: name },
    ...query,
  });
}

async function deleteGroceryStore(id: string) {
  await db.groceryStore.delete({ where: { id } });
}

export { getGroceryStores, deleteGroceryStore, createGroceryStore };
