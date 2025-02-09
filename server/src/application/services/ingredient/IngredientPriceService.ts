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
  // @ts-ignore
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

async function createPriceHistory(
  price: CreatePriceHistoryInput | CreatePriceHistoryInput[],
  query?: IngredientPriceQuery
) {
  if (Array.isArray(price)) {
    const data = price.map((p) => {
      return {
        ingredientId: p.ingredientId,
        date: p.date,
        groceryStoreId: p.groceryStoreId,
        price: p.price,
        size: p.quantity,
        unitId: p.unitId,
        pricePerUnit: p.pricePerUnit,
        foodType: p.foodType,
        receiptLineId: p.recieptLineId,
      };
    });

    return await db.ingredientPrice.createMany({
      data: data,
      ...query,
    });
  } else {
    return await db.ingredientPrice.create({
      //@ts-ignore
      data: {
        ingredient: { connect: { id: price.ingredientId } },
        date: price.date,
        groceryStore: { connect: { id: price.groceryStoreId } },
        price: price.price,
        size: price.quantity,
        unit: { connect: { id: price.unitId } },
        pricePerUnit: price.pricePerUnit,
        foodType: price.foodType,
        receiptLine: price?.recieptLineId
          ? { connect: { id: price.recieptLineId } }
          : undefined,
      },
      ...query,
    });
  }
}

async function editPriceHistory(
  priceId: string,
  price: EditPriceHistoryInput,
  query?: IngredientPriceQuery
) {
  return await db.ingredientPrice.update({
    where: {
      id: priceId,
    },
    data: {
      ingredient: price.ingredientId
        ? { connect: { id: price.ingredientId } }
        : undefined,
      receiptLine: price.recieptLineId
        ? { connect: { id: price.recieptLineId } }
        : undefined,
      date: price.date ? price.date : undefined,
      foodType: price.foodType,
      groceryStore: price.groceryStoreId
        ? {
            connect: {
              id: price.groceryStoreId,
            },
          }
        : undefined,
      price: price.price ? price.price : undefined,
      size: price.quantity ? price.quantity : undefined,
      unit: price.unitId ? { connect: { id: price.unitId } } : undefined,
      pricePerUnit: price.pricePerUnit ? price.pricePerUnit : undefined,
    },
    ...query,
  });
}

async function deletePriceHistory(id: string) {
  await db.ingredientPrice.delete({
    where: { id: id },
  });
}

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
