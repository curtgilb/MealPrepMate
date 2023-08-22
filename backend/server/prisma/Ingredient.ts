import { Prisma, Ingredient, PrismaClient } from "@prisma/client";

async function createIngredient(
  ingredient: Prisma.IngredientCreateInput,
  db: PrismaClient
): Promise<Ingredient> {
  ingredient.name = ingredient.name.toLowerCase();
  return await db.ingredient.create({
    data: ingredient,
  });
}

async function updateIngredient(
  ingredient: Prisma.IngredientUpdateInput,
  db: PrismaClient
): Promise<Ingredient> {
  ingredient.name = ingredient.name.toLowerCase();
  return await db.ingredient.update({
    where: { id: ingredient.id },
    data: ingredient,
  });
}

async function addPrice(
  price: Prisma.IngredientPriceCreateInput,
  db: PrismaClient
): {};
