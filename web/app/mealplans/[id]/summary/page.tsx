"use client";
import { useParams } from "next/navigation";
import { mealPlanQuery } from "@/graphql/mealplan/mealplan";
import { useQuery } from "@urql/next";

import { useMealPlan } from "@/hooks/use-meal-plan";
import { Suspense, useState } from "react";
import {
  WeekNumber,
  WeekSelect,
} from "@/components/mealplan/summary/WeekSelect";

import {
  averageNutrients,
  SummedNutrients,
  sumNutrients,
} from "@/utils/nutrients";
import { MealPlanServingsFieldFragment } from "@/gql/graphql";
import { useAggregateNutrients } from "@/hooks/use-aggregated-nutrients";
import { NutrientWeekSummary } from "@/deletion/NutrientSummaryChart";
import { MacroSummaryChart } from "@/deletion/MacroSummary";
import { NutritionLabel } from "@/features/nutrition/components/NutritionLabel";

export default function NutritionSummary() {
  const params = useParams<{ id: string }>();
  const { labels, recipes, servings } = useMealPlan(params.id);
  const [week, setWeek] = useState<WeekNumber>(1);
  const weeks = Array.from(servings?.keys() ?? []).sort((a, b) => b - a);
  const maxWeek = weeks ? weeks[0] : 1;
  const aggregate = useAggregateNutrients(week, servings, maxWeek, labels);
  const average = aggregate[aggregate.length - 1];
  const xAxisLabels = aggregate.map((_, index) => {
    const label = week === "Average" ? "Week" : "Day";
    if (index === aggregate.length - 1) {
      return "Average";
    }
    return `${label} ${index + 1}`;
  });
  console.log("average", average);

  return (
    <div>
      <h1>Meal Plan Nutrition Summary {params.id}</h1>
      <WeekSelect maxWeek={maxWeek} week={week} setWeek={setWeek} />
      <Suspense>
        <NutrientWeekSummary datapoints={aggregate} labels={xAxisLabels} />
        <MacroSummaryChart />
      </Suspense>
      {average && <NutritionLabel nutrientValues={average} />}
    </div>
  );
}
