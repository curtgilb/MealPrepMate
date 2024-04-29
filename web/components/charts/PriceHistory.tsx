"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  elements,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import { FoodType } from "@/gql/graphql";
import { DummyData, PriceType, Timeline } from "./PriceHistoryGroup";
import { useMemo } from "react";
import "chartjs-adapter-luxon";
import { DateTime } from "luxon";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface PriceHistoryChartProp {
  store: string;
  data: { [key: string]: DummyData[] };
  timeline: Timeline;
  priceType: PriceType;
}

function getFoodTypeColor(foodType: FoodType) {
  return {
    borderColor: "rgb(53, 162, 235)",
    backgroundColor: "rgba(53, 162, 235, 0.5)",
  };
}

export function PriceHistoryChart({
  store,
  data,
  timeline,
  priceType,
}: PriceHistoryChartProp) {
  const minDate = DateTime.now().minus({ months: 6 }).toISO();
  console.log(minDate);
  const options = {
    scales: {
      x: {
        type: "time",
        min: minDate,
      },
    },
    responsive: true,
    parsing: {
      xAxisKey: "date",
      yAxisKey: "price",
    },
    elements: {
      line: {
        stepped: true,
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };
  const dataOption = useMemo(() => {
    return {
      datasets: Object.entries(data).map(([foodType, points]) => {
        return {
          label: foodType,
          data: points,
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        };
      }),
    };
  }, [data]);

  return (
    <div>
      <p>{store}</p>
      <Line options={options} data={dataOption} />
    </div>
  );
}
