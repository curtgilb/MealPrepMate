"use client";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PriceGroup } from "@/features/ingredient/hooks/use-price-history";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { FoodType } from "@/gql/graphql";

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
    color: "hsl(var(--chart-4))",
  },
  fresh: {
    label: "Fresh",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

interface PriceHistoryProps {
  prices: PriceGroup;
}

// foodType --> color string
function getLineColor(type: FoodType | null | undefined) {
  switch (type) {
    case FoodType.Canned:
      return;
      break;

    default:
      break;
  }
}

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

export function PriceHistory({ prices }: PriceHistoryProps) {
  const [foodType, setFoodType] = useState<FoodType | "ALL">("ALL");
  const selectedDataSet =
    foodType === "ALL"
      ? Object.values(prices.byType)
      : [prices.byType[foodType]];
  if (foodType === "ALL" && prices.uncategorized) {
    selectedDataSet?.push(prices.uncategorized);
  }

  return (
    <div>
      <div className="flex justify-between">
        <p>{prices.storeName}</p>
        <Select
          defaultValue={foodType}
          onValueChange={(value) => {
            setFoodType(value as FoodType | "ALL");
          }}
        >
          <SelectTrigger className="w-[150px]">
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
      <ChartContainer config={chartConfig} className="min-h-[200px] w-[900px]">
        <LineChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          {selectedDataSet.map((dataset) => {
            return (
              <Line
                dataKey="pricePerUnit"
                type="step"
                stroke="var(--color-desktop)"
                strokeWidth={2}
                dot={false}
              />
            );
          })}

          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
