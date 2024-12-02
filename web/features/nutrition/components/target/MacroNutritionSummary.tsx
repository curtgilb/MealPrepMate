"use client";
import { TriangleAlert } from "lucide-react";
import { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { EditMacroTargets } from "@/features/nutrition/components/EditMacroTargets";
import { cn } from "@/lib/utils";
import { toTitleCase } from "@/utils/utils";

interface MacroSummaryProps {
  targetCalories?: number;
  carbs?: number;
  fat?: number;
  protein?: number;
  alcohol?: number;
}

const chartConfig = {
  carbs: {
    label: "Carbs",
    color: "hsl(var(--chart-1))",
  },
  fat: {
    label: "Fat",
    color: "hsl(var(--chart-2))",
  },
  protein: {
    label: "Protein",
    color: "hsl(var(--chart-3))",
  },
  alcohol: {
    label: "Alcohol",
    color: "hsl(var(--chart-4))",
  },
  unallocated: {
    label: "Unallocated",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function MacroSummary({
  carbs = 0,
  fat = 0,
  protein = 0,
  alcohol = 0,
  targetCalories = 0,
}: MacroSummaryProps) {
  const calorieSum = carbs * 4 + fat * 9 + protein * 4 + alcohol * 7;
  const data = useMemo(() => {
    const difference = targetCalories - calorieSum;

    return [
      {
        grams: carbs,
        macro: "carbs",
        calories: carbs * 4,
        isMacro: true,
        fill: "var(--color-carbs)",
      },
      {
        grams: fat,
        macro: "fat",
        calories: fat * 9,
        isMacro: true,
        fill: "var(--color-fat)",
      },
      {
        grams: protein,
        macro: "protein",
        calories: protein * 4,
        isMacro: true,
        fill: "var(--color-protein)",
      },
      {
        grams: alcohol,
        macro: "alcohol",
        calories: alcohol * 7,
        isMacro: true,
        fill: "var(--color-alcohol)",
      },
    ].filter((macro) => macro.calories !== 0);
  }, [carbs, fat, protein, alcohol, calorieSum, targetCalories]);

  return (
    <div>
      <h2 className="text-2xl font-serif font-semibold mb-4">Macro Summary</h2>
      <div className="flex gap-2">
        <ul className="flex flex-col gap-2">
          {data.map((item) => {
            const percentage = Math.round((item.calories / calorieSum) * 100);
            if (!item.isMacro) return null;

            return (
              <li key={item.macro}>
                <p>{percentage}%</p>
                <p className="text-sm font-medium uppercase">
                  {toTitleCase(item.macro)}
                </p>
              </li>
            );
          })}
        </ul>
        <ChartContainer config={chartConfig} className="w-full">
          <PieChart>
            <ChartTooltip
              cursor={false}
              labelFormatter={(e) => {
                return "hello";
              }}
              content={
                <ChartTooltipContent
                  hideLabel
                  indicator="line"
                  labelFormatter={(e) => {
                    return "hello";
                  }}
                />
              }
            />
            <Pie
              data={data}
              dataKey="calories"
              nameKey="macro"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    const difference = calorieSum - targetCalories;

                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 20}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {calorieSum}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy || +8}
                          className="fill-muted-foreground text-sm"
                        >
                          Calories
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className={cn("fill-muted-foreground", {
                            "text-red-600": difference < 0,
                            "text-green-700": difference > 0,
                          })}
                        >
                          {difference}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>

            <ChartLegend content={<ChartLegendContent />} />
          </PieChart>
        </ChartContainer>
      </div>
    </div>
  );
}
