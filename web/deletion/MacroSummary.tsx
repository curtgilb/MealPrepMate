"use client";
import React from "react";
import type { ChartData, ChartOptions, Plugin } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
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
import { sum } from "lodash";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

ChartJS.defaults.font.size = 16;

function getMacroFactor(type: string) {
  switch (type) {
    case "Carbs":
      return 4;
    case "Fat":
      return 9;
    case "Protein":
      return 4;
    case "Alcohol":
      return 7;
    default:
      throw new Error("Macro doesn't match");
  }
}

export const options: ChartOptions<"bar"> = {
  plugins: {
    datalabels: {
      color: "#36A2EB",
      anchor: "end",
      align: "top",
      formatter: (value, context) => {
        const datasetArray: number[] = [];
        context.chart.data.datasets.forEach((dataset) => {
          if (dataset.data[context.dataIndex]) {
            datasetArray.push(dataset.data[context.dataIndex] as number);
          }
        });
        const total = datasetArray.reduce((total, datapoint) => {
          return total + datapoint;
        }, 0);

        if (context.datasetIndex === datasetArray.length - 1) return total;
        return "";
      },
    },
    legend: {
      position: "bottom",
      align: "end",
    },
    tooltip: {
      displayColors: false,
      position: "nearest",
      callbacks: {
        title: (context) => {
          return context[0].dataset.label;
        },
        label: (context) => {
          const index = context.dataIndex;
          const value = parseFloat(context.formattedValue);
          const totalGrams =
            value / getMacroFactor(context.dataset.label as string);
          const totalCalories = context.chart.data.datasets.reduce(
            (acc, dataset) => {
              const value = dataset.data[index] as number;
              return acc + value;
            },
            0
          );
          const percentage = Math.round((value / totalCalories) * 100);
          return `${
            context.formattedValue
          } calories \n ${percentage.toString()}% \n ${Math.round(
            totalGrams
          )} grams`;
        },
      },
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
      grid: {
        display: false,
      },
    },
    y: {
      title: {
        display: true,
        text: "Calories",
      },
      stacked: true,
    },
  },
};

const labels = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"];

export const data: ChartData<"bar"> = {
  labels,
  datasets: [
    {
      label: "Carbs",
      data: labels.map(() => faker.number.int({ min: 0, max: 1000 })),
      backgroundColor: "rgb(1, 111, 185)",
    },
    {
      label: "Fat",
      data: labels.map(() => faker.number.int({ min: 0, max: 1000 })),
      backgroundColor: "rgb(234, 82, 111)",
    },
    {
      label: "Protein",
      data: labels.map(() => faker.number.int({ min: 0, max: 1000 })),
      backgroundColor: "rgb(227, 178, 60)",
    },
  ],
};

export function MacroSummaryChart() {
  return (
    <div className="grid gap-6">
      <div className="flex justify-between">
        <p className="text-xl font-semibold">Calories</p>
      </div>
      <Bar options={options} data={data} />
    </div>
  );
}
