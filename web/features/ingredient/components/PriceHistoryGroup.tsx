"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <h2 className="text-2xl font-semibold">Price History</h2>
        <div className="flex justify-end gap-x-2">
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
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {groupedPrices &&
          Object.entries(groupedPrices)?.map(([id, priceGroup]) => {
            return <PriceHistory key={id} prices={Object.values(priceGroup)} />;
          })}
      </CardContent>
    </Card>
  );
}
