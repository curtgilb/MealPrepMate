// Provided a timeframe and a the data points
// Returns which UnitTypes are in the time frame
// The datapoints categoriezed by store and food type

import { Timeframe } from "@/features/ingredient/components/PriceHistoryGroup";
import { FoodType, GetIngredientQuery, UnitType } from "@/gql/graphql";
import { DateTime } from "luxon";
import { useMemo } from "react";

// Return applicable UnitTypes[]
// grouped price points

type Ingredient = NonNullable<
  GetIngredientQuery["ingredient"]["priceHistory"]
>[number];

function getCutoffDate(timeframe: Timeframe) {
  switch (timeframe) {
    case Timeframe.YEAR1:
      return DateTime.now().minus({ years: 1 });
    case Timeframe.YEAR3:
      return DateTime.now().minus({ years: 3 });
    default:
      return DateTime.now().minus({ months: 3 });
  }
}

type GroupedPrices = {
  [key: string]: PriceGroup;
};

export type PriceGroup = {
  date: Date;
  uncategorized: Ingredient | undefined;
  canned: Ingredient | undefined;
  frozen: Ingredient | undefined;
  packaged: Ingredient | undefined;
  fresh: Ingredient | undefined;
};

export function usePriceHistory(
  timeframe: Timeframe,
  unitType: UnitType,
  prices: GetIngredientQuery["ingredient"]["priceHistory"]
) {
  const cutoffDate = getCutoffDate(timeframe).toJSDate();
  return prices
    ?.sort((a, b) => b.date - a.date)
    .reduce((groups, price) => {
      // Filter out-of-range datets and non-matching unit types.
      if (price.date >= cutoffDate) {
        // Add the grocery store
        if (!(price.groceryStore.id in groups)) {
          groups[price.groceryStore.id] = {
            storeName: price.groceryStore.name,
            uncategorized: [],
            byType: {},
          };
        }

        // Add the price to food type
        if (price.foodType) {
          if (!(price.foodType in groups[price.groceryStore.id])) {
            groups[price.groceryStore.id].byType[price.foodType] = [];
          }
          groups[price.groceryStore.id].byType[price.foodType]?.push(price);
        } else {
          groups[price.groceryStore.id].uncategorized.push(price);
        }
      }
      return groups;
    }, {} as GroupedPrices);
}
