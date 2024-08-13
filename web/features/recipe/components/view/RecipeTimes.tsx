import { HTMLAttributes } from "react";

interface RecipeTimesProps extends HTMLAttributes<HTMLUListElement> {
  prep: number | null | undefined;
  marinade: number | null | undefined;
  cook: number | null | undefined;
  total: number | null | undefined;
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

export function RecipeTimes({ prep, marinade, cook, total }: RecipeTimesProps) {
  return (
    <ul className="flex gap-8">
      <li>
        <p className="text-lg font-medium text-center">{equalizeTime(prep)}</p>
        <p className="text-sm text-center">Prep Time</p>
      </li>

      <li>
        <p className="text-lg font-medium text-center">
          {equalizeTime(marinade)}
        </p>
        <p className="text-sm text-center">Marinade Time</p>
      </li>

      <li>
        <p className="text-lg font-medium text-center">{equalizeTime(cook)}</p>
        <p className="text-sm text-center">Cook Time</p>
      </li>

      <li>
        <p className="text-lg font-medium text-center">{equalizeTime(total)}</p>
        <p className="text-sm text-center">Total Time</p>
      </li>
    </ul>
  );
}
