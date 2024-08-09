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
  prices: PriceGroup[];
}

export function PriceHistory({ prices }: PriceHistoryProps) {
  const [foodType, setFoodType] = useState<FoodType | "ALL">("ALL");

  return (
    <div className="w-full max-w-96">
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
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            scale="time"
            tickFormatter={(unixTime) =>
              new Date(unixTime).toLocaleDateString()
            }
          />

          <Line
            dataKey="fresh.pricePerUnit"
            type="step"
            stroke="var(--color-fresh)"
            strokeWidth={2}
            dot={false}
          />

          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
