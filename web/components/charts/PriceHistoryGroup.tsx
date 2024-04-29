"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PriceHistoryChart } from "./PriceHistory";
import { faker } from "@faker-js/faker";
import { FoodType, IngredientPriceHistory } from "@/gql/graphql";
import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

export interface DummyData {
  id: string;
  date: Date;
  foodType: FoodType;
  groceryStore: { id: string; name: string };
  price: number;
  pricePerUnit: number;
  quantity: number;
  unit: {
    id: string;
    name: string;
    symbol: string;
  };
}
function createPricePoint(): DummyData {
  const price = faker.number.float({ min: 0.5, max: 15, fractionDigits: 2 });
  const quantity = faker.number.int({ max: 15, min: 1 });
  return {
    id: faker.string.uuid(),
    date: faker.date.between({
      from: "2020-04-23T00:00:00.000Z",
      to: "2024-04-23T00:00:00.000Z",
    }),
    foodType: faker.helpers.enumValue(FoodType),
    groceryStore: faker.helpers.arrayElement([
      { id: faker.string.uuid(), name: "Walmart" },
      { id: faker.string.uuid(), name: "Winco" },
      { id: faker.string.uuid(), name: "Costco" },
      { id: faker.string.uuid(), name: "Smith's" },
    ]),
    price,
    quantity,
    pricePerUnit: price / quantity,
    unit: {
      id: "2",
      name: "pound",
      symbol: "lb",
    },
  };
}

const data: DummyData[] = [];
for (let i = 0; i < 250; i++) {
  data.push(createPricePoint());
}

type Aggregated = {
  [key: string]: { [key: string]: DummyData[] };
};

export type Timeline = "months6" | "year1" | "year2";
export type PriceType = "total_price" | "pric_per_unit";

export function PriceHistoryGroup({ prices = data }: { prices: DummyData[] }) {
  const [timeFrame, setTimeframe] = useState<Timeline>("months6");
  const [priceType, setPriceType] = useState<PriceType>("total_price");

  const groupedPrices = useMemo(() => {
    return prices.reduce((acc: Aggregated, price) => {
      const { groceryStore, foodType } = price;

      if (!(groceryStore.name in acc)) {
        acc[groceryStore.name] = {};
      }

      if (!(foodType in acc[groceryStore.name])) {
        acc[groceryStore.name][foodType] = [];
      }
      acc[groceryStore.name][foodType].push(price);

      return acc;
    }, {});
  }, [prices]);

  return (
    <div>
      <div className="flex justify-between">
        <Tabs
          value={timeFrame}
          onValueChange={(value) => {
            setTimeframe(value as Timeline);
          }}
          className="w-[400px]"
        >
          <TabsList>
            <TabsTrigger value="months6">6 months</TabsTrigger>
            <TabsTrigger value="year1">1 year</TabsTrigger>
            <TabsTrigger value="year2">2 years</TabsTrigger>
          </TabsList>
        </Tabs>

        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue defaultValue="ppu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tp">Total Price</SelectItem>
            <SelectItem value="ppu">Price per unit</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(groupedPrices).map(([store, prices]) => {
          return (
            <PriceHistoryChart
              key={store}
              store={store}
              data={prices}
              timeline={timeFrame}
              priceType={priceType}
            />
          );
        })}
      </div>
    </div>
  );
}
