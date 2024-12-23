"use client";
import { toNumber } from "lodash";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceArea,
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
import { NutrientTargetFieldsFragment, TargetPreference } from "@/gql/graphql";
import { useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

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
  nutrientValue: number;
};

// Values should all be passed in as calories
interface NutrientChartProps {
  target: NutrientTargetFieldsFragment["target"];
  dri: NutrientTargetFieldsFragment["dri"];
  data: CalorieDistributionPoint[];
  unit: string | null | undefined;
}

const chartConfig = {
  nutrientValue: {
    label: "Amount",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export function NutrientChart({ data, target, dri, unit }: NutrientChartProps) {
  const [displayTarget, setDisplayTarget] = useState<boolean>(true);
  const [displayDri, setDisplayDri] = useState<boolean>(false);
  const isEmpty = data.every((nutrient) => nutrient.nutrientValue === 0);

  const targetArea = useMemo(() => {
    if (!target || !target.threshold) return undefined;
    const { preference } = target;
    const margin = target.nutrientTarget * (target.threshold * 0.01);
    return {
      // Bottom Bounds
      x1: "Sun",
      x2: "Sat",
      y1:
        preference !== TargetPreference.Over
          ? target.nutrientTarget - margin
          : target.nutrientTarget,
      // Top bounds
      y2:
        preference !== TargetPreference.Under
          ? target.nutrientTarget + margin
          : target.nutrientTarget,
    };
  }, [target]);

  return (
    <div>
      <ChartContainer config={chartConfig}>
        <BarChart accessibilityLayer data={isEmpty ? undefined : data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="day"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />

          {target && displayTarget && (
            <>
              <ReferenceLine
                y={toNumber(target.nutrientTarget)}
                stroke="rgb(22 163 74)"
                strokeDasharray="3 3"
                label={{ value: "Target", position: "insideLeft", dy: 7 }}
                ifOverflow="extendDomain"
              />

              <ReferenceArea
                {...targetArea}
                fill="rgb(34 197 94)"
                fillOpacity={0.4}
                stroke="none"
                ifOverflow="extendDomain"
              />
            </>
          )}

          {dri && displayDri && (
            <>
              <ReferenceLine
                y={toNumber(dri.value)}
                strokeDasharray="3 3"
                label={{ value: "DRI", position: "insideLeft", dy: 7 }}
                ifOverflow="extendDomain"
              />

              <ReferenceLine
                y={toNumber(dri.value)}
                stroke="rgb(22 163 74)"
                strokeDasharray="3 3"
                label={{ value: "Upper Limit", position: "insideRight", dy: 7 }}
                ifOverflow="extendDomain"
              />
            </>
          )}

          <YAxis
            width={34}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />

          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel hideIndicator />}
          />
          <Bar
            dataKey="nutrientValue"
            fill="var(--color-nutrientValue)"
            radius={8}
          />
        </BarChart>
      </ChartContainer>
      <div className="flex gap-4 mt-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="target"
            checked={displayTarget}
            onCheckedChange={(checked) => {
              setDisplayTarget(checked === "indeterminate" ? false : checked);
            }}
            disabled={target === undefined || target === null}
          />
          <label
            htmlFor="taget"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Custom target
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="dri"
            checked={displayDri}
            onCheckedChange={(checked) => {
              setDisplayDri(checked === "indeterminate" ? false : checked);
            }}
            disabled={!dri}
          />
          <label
            htmlFor="dri"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            DRI and Upper Limit
          </label>
        </div>
      </div>
    </div>
  );
}
