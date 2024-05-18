"use client";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface MacroPieChartProps {
  protein: number;
  fat: number;
  alcohol: number;
  carbs: number;
}

export function MacroPieChart({
  protein,
  fat,
  alcohol,
  carbs,
}: MacroPieChartProps) {
  const data = {
    labels: ["Protien", "Fat", "Alcohol", "Carbs"],
    datasets: [
      {
        label: "% of calories",
        data: [protein, fat, alcohol, carbs],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
      },
    ],
  };
  return <Doughnut data={data} />;
}
