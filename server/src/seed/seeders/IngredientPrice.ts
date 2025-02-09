import { CreatePriceHistoryInput } from "@/application/services/ingredient/IngredientPriceService.js";
import { faker } from "@faker-js/faker";
import { FoodType } from "@prisma/client";

// For each ingredient pick 2-3 grocery stores
// For each store, create 2 year history of prices with 2-3 different variants.

// Walamrt, Costco, Winco, Smiths
const groceryStores = [
  "8a2f4898-5337-48cc-af07-d0be5f0f2068",
  "99d9d6db-055c-4380-a4aa-5e79ae6dccef",
  "3592f15c-e97c-4d0b-aede-6577af99d4bb",
  "bd4e2380-ca61-42fe-9219-87319eeefe79",
];
const foodTypes: FoodType[] = [
  FoodType.FROZEN,
  FoodType.CANNED,
  FoodType.FRESH,
  FoodType.PACKAGED,
];

function generateDates(): Date[] {
  return Array.from({ length: 78 }, () => {
    return faker.date.between({
      from: "2023-07-30",
      to: "2025-01-30",
    });
  }).sort((a: Date, b: Date) => a.getTime() - b.getTime());
}

function generateUniqueIntegers(
  count: number,
  min: number,
  max: number
): number[] {
  // Validate input
  if (count > max - min + 1) {
    throw new Error(
      "Cannot generate more unique numbers than the range allows"
    );
  }

  const uniqueNumbers = new Set<number>();

  while (uniqueNumbers.size < count) {
    uniqueNumbers.add(faker.number.int({ min, max }) as number);
  }

  return Array.from(uniqueNumbers);
}

export function generateFakeIngredientPriceHistory(ingredientId: string) {
  const prices: CreatePriceHistoryInput[] = [];
  const numOfGroceryStores = faker.number.int({ min: 1, max: 4 });
  const groceryStoreIds = generateUniqueIntegers(
    numOfGroceryStores,
    0,
    groceryStores.length - 1
  );

  for (const store_idx in groceryStoreIds) {
    const store = groceryStores[store_idx];
    const numOfFoodTypes = faker.number.int({ min: 1, max: 4 });
    const food_idxs = generateUniqueIntegers(numOfFoodTypes, 0, 3);
    for (const foodType in food_idxs) {
      const dates = generateDates();
      for (const date of dates) {
        prices.push({
          ingredientId: ingredientId,
          date: date,
          groceryStoreId: store,
          price: faker.number.float({ min: 0.5, max: 10, fractionDigits: 2 }),
          quantity: faker.number.int({ min: 1, max: 10 }),
          unitId: "c30a59ae-53e4-4013-a956-16badaf682db",
          pricePerUnit: faker.number.float({
            min: 0.5,
            max: 5,
            fractionDigits: 2,
          }),
          foodType: foodTypes[foodType] as FoodType,
        });
      }
    }
  }
  return prices;
}

const result = generateFakeIngredientPriceHistory("1");
console.log("finish");
