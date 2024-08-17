"use client";
import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import { SummedNutrients } from "@/utils/nutrients";
import {
  NutrientItem,
  NutrientPicker,
} from "../components/pickers/NutrientPicker";
import { useNutrients } from "@/hooks/use-nutrients";
import Annotations from "chartjs-plugin-annotation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Annotations
);

interface NutrientWeekSummary {
  datapoints: (SummedNutrients | undefined)[];
  labels: string[];
}

export function NutrientWeekSummary({
  datapoints,
  labels,
}: NutrientWeekSummary) {
  const [nutrient, setNutrient] = useState<NutrientItem | undefined>();
  const { all } = useNutrients(true);
  const nutrientInfo = all?.get(nutrient?.id ?? "");
  const dataset = datapoints.map((point) => {
    if (point && nutrient?.id) {
      return point.nutrients.get(nutrient.id) ?? 0;
    }
    return 0;
  });

  const target = nutrientInfo?.customTarget ?? nutrientInfo?.dri?.value;

  const options = {
    responsive: true,
    plugins: {
      annotation: {
        annotations: {
          line1: {
            type: "line",
            display: target !== undefined,
            label: {
              backgroundColor: "rgba(0,0,0,0.8)",
              content: `Target: ${target} ${nutrientInfo?.unit.symbol}`,
              display: true,
            },
            yMin: target,
            yMax: target,
            borderColor: "rgb(255, 99, 132)",
            borderWidth: 2,
          },
        },
      },
    },
  };

  const data = {
    labels: labels,
    datasets: [
      {
        label: nutrient?.name,
        data: dataset,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  return (
    <div>
      <div className="flex">
        <h2>Nutrient Summary</h2>
        <NutrientPicker
          select={(nutrient) => {
            setNutrient(nutrient);
          }}
          create={false}
          deselect={() => {
            setNutrient(undefined);
          }}
          selectedIds={nutrient ? [nutrient.id] : []}
          placeholder="Select a nutrient"
          multiselect={false}
        />
      </div>

      <Bar options={options} data={data} />
    </div>
  );
}
