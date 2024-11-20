"use client";
import { useState } from 'react';

import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { PriceHistory } from '@/features/ingredient/components/PriceHistory';
import { usePriceHistory } from '@/features/ingredient/hooks/use-price-history';
import { GetIngredientQuery, IngredientFieldsFragment, UnitType } from '@/gql/graphql';

export enum Timeframe {
  Months3 = "3_MONTHS",
  YEAR1 = "1_YEAR",
  YEAR3 = "3_YEARS",
}

interface PriceHistoryGroupProps {
  prices: IngredientFieldsFragment["priceHistory"];
}

export function PriceHistoryGroup({ prices }: PriceHistoryGroupProps) {
  const [timeFrame, setTimeframe] = useState<Timeframe>(Timeframe.YEAR3);
  const [unitType, setUnitType] = useState<UnitType>(UnitType.Weight);
  const groupedPrices = usePriceHistory(timeFrame, unitType, prices);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-serif">Price History</h2>
        <div className="flex justify-end gap-x-2">
          <Select
            value={unitType}
            onValueChange={(value) => setUnitType(value as UnitType)}
          >
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

          <Select
            defaultValue="3months"
            value={timeFrame}
            onValueChange={(value) => setTimeframe(value as Timeframe)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue defaultValue="ppu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3_MONTHS">Last 3 months</SelectItem>
              <SelectItem value="1_YEAR">Last year</SelectItem>
              <SelectItem value="3_YEARS">Last 3 years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
        {groupedPrices &&
          Object.entries(groupedPrices)?.map(([id, priceGroup]) => {
            return <PriceHistory key={id} prices={Object.values(priceGroup)} />;
          })}
      </div>
    </div>
  );
}
