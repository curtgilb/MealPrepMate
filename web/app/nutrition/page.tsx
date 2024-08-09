"use client";
import { NutrientRanking } from "@/features/nutrition/components/NutrientRanking";
import { MacroSummary } from "@/features/nutrition/components/target/MacroNutritionSummary";
import { NutritionTargets } from "@/features/nutrition/components/target/NutrientTarget";

export default function NutritionPage() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <MacroSummary carbs={90} fat={30} protein={130} calories={1800} />
      <NutrientRanking />
      <NutritionTargets className="col-span-2" />
    </div>
  );
}
