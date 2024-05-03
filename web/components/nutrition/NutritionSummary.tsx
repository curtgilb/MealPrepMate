"use client";
import { useNutrients } from "@/hooks/use-nutrients";
import { useState } from "react";
import { NutrientSummaryCard } from "./NutrientSummary";

interface NutritionSummaryProps {
  values: { [key: string]: number };
}

export function NutritionSummary({ values }: NutritionSummaryProps) {
  const [advanced, setAdvanced] = useState<boolean>(false);
  const [groupCategory, childLookup] = useNutrients(advanced);

  return (
    <div>
      {Object.entries(groupCategory).map(([category, nutrient]) => {
        return (
          <div key={category}>
            <p>{category}</p>
            {nutrient.map((nutrient) => {
              const value = nutrient.id in values ? values[nutrient.id] : 0;
              const target = nutrient.customTarget ?? undefined;
              const children =
                nutrient.id in childLookup ? childLookup[nutrient.id] : [];
              return (
                <NutrientSummaryCard
                  id={nutrient.id}
                  key={nutrient.id}
                  name={nutrient.name}
                  value={value}
                  target={target}
                  unit={nutrient.unit.symbol ?? ""}
                  childNutrients={children}
                  childLookup={childLookup}
                  values={values}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
