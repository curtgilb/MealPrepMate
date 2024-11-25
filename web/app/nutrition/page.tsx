"use client";
import { NutrientRanking } from "@/features/nutrition/components/NutrientRanking";
import { MacroSummary } from "@/features/nutrition/components/target/MacroNutritionSummary";
import { NutritionTargets } from "@/features/nutrition/components/target/NutrientTarget";
import { TDEECalculator } from "@/features/nutrition/components/TDEECalculator";

export default function NutritionPage() {
  return (
    <div>
      <h1 className="font-serif text-4xl font-extrabold mb-8">Nutrition</h1>

      <NutritionTargets className="col-span-3" />
    </div>
  );
}
