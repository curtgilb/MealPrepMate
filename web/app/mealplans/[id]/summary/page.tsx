"use client";
import { useParams } from "next/navigation";
import { useMealPlan } from "@/hooks/use-meal-plan";
import { Suspense, useState } from "react";
import { NutritionLabel } from "@/features/nutrition/components/Label";
import { useAggregateNutrients } from "@/hooks/use-aggregated-nutrients";

export default function NutritionSummary() {
  return (
    <h1>Meal Plan Nutrition Summary</h1>
    // <div>
    //   <h1>Meal Plan Nutrition Summary {params.id}</h1>
    //   <WeekSelect maxWeek={maxWeek} week={week} setWeek={setWeek} />
    //   <Suspense>
    //     <NutrientWeekSummary datapoints={aggregate} labels={xAxisLabels} />
    //     <MacroSummaryChart />
    //   </Suspense>
    //   {average && <NutritionLabel nutrientValues={average} />}
    // </div>
  );
}
