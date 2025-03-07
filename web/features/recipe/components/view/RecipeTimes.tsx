import { StackedList } from "@/components/StackedList";
import { HTMLAttributes } from "react";

interface RecipeTimesProps extends HTMLAttributes<HTMLUListElement> {
  prep: number | null | undefined;
  marinade: number | null | undefined;
  cook: number | null | undefined;
}

function equalizeTime(mins: number | undefined | null) {
  if (!mins) return "--";
  if (mins >= 61) {
    const hrs = Math.floor(mins / 60);
    const remainderMins = mins % 60;
    return `${hrs}:${remainderMins} ${hrs > 1 ? "hrs" : "hr"}`;
  }
  return `${mins} ${mins > 1 ? "mins" : "min"}`;
}

export function RecipeTimes({ prep, marinade, cook }: RecipeTimesProps) {
  const list = [
    { id: "prep", top: equalizeTime(prep), bottom: "Prep Time" },
    { id: "marinade", top: equalizeTime(marinade), bottom: "Marinade Time" },
    { id: "cook", top: equalizeTime(cook), bottom: "Cook Time" },
  ];
  const totalTime = [prep, marinade, cook].reduce((acc, time) => {
    if (typeof time === "number") {
      return acc + time;
    }
    return acc;
  }, 0 as number);

  list.push({
    id: "total",
    top: equalizeTime(totalTime),
    bottom: "Total Time",
  });

  return <StackedList items={list} />;
}
