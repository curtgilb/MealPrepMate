"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AbbreviatedDay } from "@/features/mealplan/components/sidebar/nutrition/charts/CalorieDistributionChart";

export type CalorieDistributionPoint = {
  day: AbbreviatedDay;
  balance: number;
};

interface CalorieBalanceInterface {
  data: CalorieDistributionPoint[];
}

const chartConfig = {
  balance: {
    label: "Balance",
  },
} satisfies ChartConfig;

export function CalorieBalanceChart({ data }: CalorieBalanceInterface) {
  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />

        <YAxis
          width={34}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <XAxis
          dataKey="day"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel hideIndicator />}
        />
        <Bar dataKey="balance" radius={3}>
          {data.map((item) => (
            <Cell
              key={item.day}
              fill={
                item.balance > 0
                  ? "hsl(var(--success))"
                  : "hsl(var(--destructive))"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
