"use client";
import { NutrientRanking } from "@/components/nutrition/NutrientRanking";
import { MacroSummary } from "@/components/nutrition/target/MacroNutritionSummary";
import { NutritionTargets } from "@/components/nutrition/target/NutrientTarget";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export default function NutritionPage() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <MacroSummary carbs={90} fat={30} protein={130} />
      <NutrientRanking />
      <NutritionTargets className="col-span-2" />
    </div>
  );
}
