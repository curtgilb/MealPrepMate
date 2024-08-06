"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PriceHistory } from "@/features/ingredient/components/PriceHistory";
import { usePriceHistory } from "@/features/ingredient/hooks/use-price-history";
import { GetIngredientQuery, UnitType } from "@/gql/graphql";
import { useState } from "react";

export enum Timeframe {
  Months3 = "3_MONTHS",
  YEAR1 = "1_YEAR",
  YEAR3 = "3_YEARS",
}

interface PriceHistoryGroupProps {
  prices: GetIngredientQuery["ingredient"]["priceHistory"];
}

export function PriceHistoryGroup({ prices }: PriceHistoryGroupProps) {
  const [timeFrame, setTimeframe] = useState<Timeframe>(Timeframe.YEAR3);
  const [unitType, setUnitType] = useState<UnitType>(UnitType.Weight);
  const groupedPrices = usePriceHistory(timeFrame, unitType, prices);
  console.log(groupedPrices);

  return (
    <div className="grid grid-cols-2">
      <div className="flex justify-end gap-x-4">
        <Select defaultValue="WEIGHT">
          <SelectTrigger className="w-[150px]">
            <SelectValue defaultValue="ppu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="WEIGHT">Weight</SelectItem>
            <SelectItem value="VOLUME">Volume</SelectItem>
            <SelectItem value="LENGTH">Length</SelectItem>
            <SelectItem value="COUNT">Count</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="3months">
          <SelectTrigger className="w-[150px]">
            <SelectValue defaultValue="ppu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3months">Last 3 months</SelectItem>
            <SelectItem value="1year">Last year</SelectItem>
            <SelectItem value="3years">Last 3 years</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {groupedPrices &&
        Object.entries(groupedPrices)?.map(([id, priceGroup]) => {
          return <PriceHistory key={id} prices={priceGroup} />;
        })}
    </div>
  );
}

// type price = {
//   id: string;
//   date?: any | null;
//   foodType?: FoodType | null;
//   price: number;
//   pricePerUnit: number;
//   quantity: number;
//   groceryStore: {
//     id: string;
//     name: string;
//   };
//   unit: {
//     id: string;
//     name: string;
//     symbol?: string | null;
//     conversionName?: string | null;
//     measurementSystem?: MeasurementSystem | null;
//     type?: UnitType | null;
//   };
// };

// enum MeasurementSystem {
//   Imperial = "IMPERIAL",
//   Metric = "METRIC",
// }

// enum MeasurementSystem {
//   Imperial = "IMPERIAL",
//   Metric = "METRIC",
// }

// export enum FoodType {
//   Canned = "CANNED",
//   Fresh = "FRESH",
//   Frozen = "FROZEN",
//   Packaged = "PACKAGED",
// }
