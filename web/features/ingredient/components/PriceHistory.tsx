"use client";
import { useState } from 'react';
import { CartesianGrid, Line, LineChart, TooltipProps, XAxis, YAxis } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

import {
    ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent
} from '@/components/ui/chart';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { PriceGroup } from '@/features/ingredient/hooks/use-price-history';
import { FoodType } from '@/gql/graphql';

const chartConfig = {
  uncategorized: {
    label: "Uncategorized",
    color: "hsl(var(--chart-1))",
  },
  canned: {
    label: "Canned",
    color: "hsl(var(--chart-2))",
  },
  frozen: {
    label: "Frozen",
    color: "hsl(var(--chart-3))",
  },
  packaged: {
    label: "Packaged",
    color: "hsl(var(--chart-5))",
  },
  fresh: {
    label: "Fresh",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

interface PriceHistoryProps {
  prices: PriceGroup[];
}

type PriceGroupType =
  | "fresh"
  | "canned"
  | "frozen"
  | "packaged"
  | "uncategorized";

export function PriceHistory({ prices }: PriceHistoryProps) {
  const [foodType, setFoodType] = useState<FoodType | "ALL">("ALL");
  console.log(prices);

  let dataLines = [];

  // for (const )
  // Object.entries(prices[0]).filter(([key, value]) => value !== undefined);

  return (
    <div className="w-full">
      <div className="flex justify-between">
        <p className="text-lg text-semibold">{prices[0].storeName}</p>
        <Select
          defaultValue={foodType}
          onValueChange={(value) => {
            setFoodType(value as FoodType | "ALL");
          }}
        >
          <SelectTrigger className="w-[120px] h-6 tex-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="CANNED">Canned</SelectItem>
            <SelectItem value="FRESH">Fresh</SelectItem>
            <SelectItem value="FROZEN">Frozen</SelectItem>
            <SelectItem value="PACKAGED">Packaged</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ChartContainer config={chartConfig} className="min-h-[200px]">
        <LineChart accessibilityLayer data={prices}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(unixTime) =>
              new Date(unixTime).toLocaleDateString("en-US", {
                month: "short",
                year: "2-digit",
              })
            }
          />
          <YAxis tickFormatter={(value) => `$${value.toFixed(2)}`} />

          <Line
            dataKey="fresh.pricePerUnit"
            type="step"
            stroke="var(--color-fresh)"
            strokeWidth={2}
            dot={true}
          />
          <Line
            dataKey="canned.pricePerUnit"
            type="step"
            stroke="var(--color-fresh)"
            strokeWidth={2}
            dot={true}
          />
          <Line
            dataKey="frozen.pricePerUnit"
            type="step"
            stroke="var(--color-fresh)"
            strokeWidth={2}
            dot={true}
          />

          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelKey="date"
                labelFormatter={(value, payload) => {
                  const date = payload?.[0]?.payload.date;
                  return new Date(date).toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                  });
                }}
                formatter={(value, name, props) => {
                  if (typeof name !== "string") return null;
                  const type = name.split(".")[0] as PriceGroupType;
                  const fullDataPoint = (props.payload as PriceGroup)[type];
                  const unit = fullDataPoint?.unit.symbol;

                  return (
                    <div>
                      <p>${Number(fullDataPoint?.price).toFixed(2)} total</p>
                      <p>
                        ${Number(fullDataPoint?.pricePerUnit).toFixed(2)}/
                        {unit ?? "unit"}
                      </p>
                    </div>
                  );
                }}
              />
            }
          />
          <ChartLegend content={<ChartLegendContent nameKey="storeName" />} />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
