"use client";
import { toNumber } from "lodash";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { NutrientTargetFieldsFragment } from "@/gql/graphql";

export type AbbreviatedDay =
  | "Sun"
  | "Mon"
  | "Tues"
  | "Wed"
  | "Thurs"
  | "Fri"
  | "Sat";

export type CalorieDistributionPoint = {
  day: AbbreviatedDay;
  fat: number;
  protein: number;
  carbs: number;
  alcohol: number;
  calories: number;
};

// Values should all be passed in as calories
interface WeekCalorieChartProps {
  target: NutrientTargetFieldsFragment["target"] | null | undefined;
  data: CalorieDistributionPoint[];
}

const chartConfig = {
  fat: {
    label: "Fat",
    color: "hsl(var(--chart-1))",
  },
  protein: {
    label: "Protein",
    color: "hsl(var(--chart-2))",
  },
  carbs: {
    label: "Carbs",
    color: "hsl(var(--chart-3))",
  },
  alcohol: {
    label: "Alcohol",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export function WeekCalorieChart({ data, target }: WeekCalorieChartProps) {
  const totalCalories = data.reduce((total, dataPoint) => {
    return (total += dataPoint.calories);
  }, 0);

  console.log(target);
  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={data}>
        {target?.nutrientTarget && (
          <ReferenceLine
            y={toNumber(target.nutrientTarget)}
            stroke="hsl(var(--destructive))"
            strokeDasharray="3 3"
            label={{
              value: `Target (${Math.round(
                toNumber(target.nutrientTarget)
              )} kcal)`,
              position: "right",
              fill: "hsl(var(--destructive))",
              fontSize: 12,
              className: "font-medium",
            }}
            ifOverflow="extendDomain"
          />
        )}

        <CartesianGrid vertical={false} />

        <XAxis
          dataKey="day"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />

        <YAxis />

        <Bar
          dataKey="carbs"
          stackId="a"
          fill="var(--color-carbs)"
          radius={[0, 0, 4, 4]}
        />
        <Bar
          dataKey="fat"
          stackId="a"
          fill="var(--color-fat)"
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="alcohol"
          stackId="a"
          fill="var(--color-alcohol)"
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="protein"
          stackId="a"
          fill="var(--color-protein)"
          radius={[4, 4, 0, 0]}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              hideLabel
              className="w-[180px]"
              formatter={(value, name, item, index) => (
                <>
                  <div
                    className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                    style={
                      {
                        "--color-bg": `var(--color-${name})`,
                      } as React.CSSProperties
                    }
                  />
                  {chartConfig[name as keyof typeof chartConfig]?.label || name}
                  <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                    {Math.round(toNumber(value))}
                    <span className="font-normal text-muted-foreground">
                      kcal
                    </span>
                  </div>
                  {/* Add this after the last item */}
                  {index === 3 && (
                    <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium text-foreground">
                      Total
                      <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                        {Math.round(toNumber(item.payload.calories))}
                        <span className="font-normal text-muted-foreground">
                          kcal
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
            />
          }
          cursor={false}
        />
      </BarChart>
    </ChartContainer>
  );
}
