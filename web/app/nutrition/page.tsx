"use client";
import { NutritionTargets } from '@/features/nutrition/components/target/NutrientTarget';

export default function NutritionPage() {
  return (
    <div>
      <h1 className="font-serif text-4xl font-extrabold mb-8">Nutrition</h1>

      <NutritionTargets className="col-span-3" />
    </div>
  );
}
