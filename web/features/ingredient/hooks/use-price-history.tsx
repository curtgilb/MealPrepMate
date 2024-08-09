// Provided a timeframe and a the data points
// Returns which UnitTypes are in the time frame
// The datapoints categoriezed by store and food type

import { Timeframe } from "@/features/ingredient/components/PriceHistoryGroup";
import { FoodType, GetIngredientQuery, UnitType } from "@/gql/graphql";
import { DateTime } from "luxon";
import { useMemo } from "react";

// Return applicable UnitTypes[]
// grouped price points

type PricePoint = NonNullable<
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
  [key: string]: { [key: string]: PriceGroup };
};

export type PriceGroup = {
  date: Date;
  storeName: string;
  uncategorized: PricePoint | undefined;
  canned: PricePoint | undefined;
  frozen: PricePoint | undefined;
  packaged: PricePoint | undefined;
  fresh: PricePoint | undefined;
};

function addPriceToGroup(
  price: PricePoint,
  groups: GroupedPrices,
  dateString: string
) {
  switch (price.foodType) {
    case FoodType.Canned:
      groups[price.groceryStore.id][dateString].canned = price;
      break;
    case FoodType.Fresh:
      groups[price.groceryStore.id][dateString].fresh = price;
      break;
    case FoodType.Frozen:
      groups[price.groceryStore.id][dateString].frozen = price;
      break;
    case FoodType.Packaged:
      groups[price.groceryStore.id][dateString].packaged = price;
      break;
    default:
      groups[price.groceryStore.id][dateString].uncategorized = price;
      break;
  }
}

export function usePriceHistory(
  timeframe: Timeframe,
  unitType: UnitType,
  prices: GetIngredientQuery["ingredient"]["priceHistory"]
) {
  const cutoffDate = getCutoffDate(timeframe).toJSDate();
  return prices
    ?.sort((a, b) => a.date - b.date)
    .reduce((groups, price) => {
      // Filter out-of-range datets and non-matching unit types.
      if (price.date >= cutoffDate) {
        if (!(price.groceryStore.id in groups)) {
          groups[price.groceryStore.id] = {};
        }
        // Add the date object
        const dateString = price.date.toISOString().split("T")[0];
        if (!(dateString in groups[price.groceryStore.id])) {
          groups[price.groceryStore.id][dateString] = {
            date: price.date,
            storeName: price.groceryStore.name,
            uncategorized: undefined,
            canned: undefined,
            frozen: undefined,
            packaged: undefined,
            fresh: undefined,
          };
        }
        addPriceToGroup(price, groups, dateString);
      }
      return groups;
    }, {} as GroupedPrices);
}
