"use client";
import { useState } from "react";
import { Label, Pie, PieChart, Sector } from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

const chartConfig = {
  carbs: {
    label: "Carbs",
    color: "hsl(var(--chart-1))",
  },
  fat: {
    label: "Fat",
    color: "hsl(var(--chart-3))",
  },
  protein: {
    label: "Protein",
    color: "hsl(var(--chart-2))",
  },
  alcohol: {
    label: "Alcohol",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export type MacroTypes = keyof typeof chartConfig;
interface MacroChartProps {
  data: {
    type: MacroTypes;
    value: number;
    calories: number;
    target: number | undefined;
  }[];
}

export function MacroChart({ data }: MacroChartProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const dataWithColors = data.map((macro) => {
    return {
      ...macro,
      fill: `var(--color-${macro.type})`,
    };
  });

  const totalCalories = data.reduce(
    (total, macro) => total + macro.calories,
    0
  );

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square w-full  max-w-[250px]"
    >
      <PieChart>
        <Pie
          data={dataWithColors}
          dataKey="calories"
          nameKey="type"
          innerRadius={70}
          strokeWidth={5}
          activeIndex={activeIndex}
          activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
            <g>
              {/* inner line */}
              <Sector {...props} outerRadius={outerRadius + 4} />
              {/* Outer line */}
              <Sector
                {...props}
                outerRadius={outerRadius + 14}
                innerRadius={outerRadius + 8}
              />
            </g>
          )}
          onMouseEnter={(_, index) => {
            setActiveIndex(index);
          }}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {Math.round(data[activeIndex].value)} g
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      {`${data[activeIndex].type.toLocaleString()} ${Math.round(
                        (data[activeIndex].calories / totalCalories) * 100
                      )}%`}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
