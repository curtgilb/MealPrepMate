"use client";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface MacroPieChartProps {
  protien: number;
  fat: number;
  alcohol: number;
  carbohydrates: number;
}

export const data = {
  labels: ["Protien", "Fat", "Alcohol", "Carbohydrates"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
      ],
    },
  ],
};

export function MacroPieChart({
  protien,
  fat,
  alcohol,
  carbohydrates,
}: MacroPieChartProps) {
  return <Doughnut data={data} />;
}
