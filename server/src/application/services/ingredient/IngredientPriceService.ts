import { AllowUndefined } from "@/application/types/CustomTypes.js";
import { db } from "@/infrastructure/repository/db.js";
import { FoodType, Prisma } from "@prisma/client";

type CreatePriceHistoryInput = {
  ingredientId: string;
  date: Date;
  groceryStoreId: string;
  price: number;
  quantity: number;
  unitId: string;
  pricePerUnit: number;
  foodType: FoodType;
  recieptLineId?: string | undefined;
};

type EditPriceHistoryInput = AllowUndefined<CreatePriceHistoryInput>;

type IngredientPriceFilter = {
  beginDate?: string | null;
  endDate?: string | null;
  groceryStoreId?: string | null;
  unitId?: string | null;
  foodType?: FoodType | null;
};

type IngredientPriceQuery = {
  include?: Prisma.IngredientPriceInclude | undefined;
  select?: Prisma.IngredientPriceSelect | undefined;
};

async function getIngredientPrice(id: string, query?: IngredientPriceQuery) {
  return await db.ingredientPrice.findUniqueOrThrow({
    // @ts-ignore
    where: { id: id },
    ...query,
  });
}

async function getIngredientPrices(
  ingredientId: string,
  filter: IngredientPriceFilter | undefined | null,
  query?: IngredientPriceQuery
) {
  return await db.ingredientPrice.findMany({
    where: {
      ingredientId: ingredientId,
      date: {
        gte: filter?.beginDate ?? undefined,
        lte: filter?.endDate ?? undefined,
      },
      groceryStoreId: filter?.groceryStoreId ?? undefined,
      foodType: filter?.foodType ?? undefined,
    },
    orderBy: {
      date: "asc",
    },
    ...query,
  });
}

async function createPriceHistory() {}

async function editPriceHistory() {}

async function deletePriceHistory() {}

export {
  CreatePriceHistoryInput,
  EditPriceHistoryInput,
  IngredientPriceFilter,
  getIngredientPrice,
  getIngredientPrices,
  createPriceHistory,
  editPriceHistory,
  deletePriceHistory,
};
