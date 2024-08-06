import { Progress } from "../ui/progress";

interface NutrientBarProps {
  value: number;
  goal: number;
  unit: string;
  name: string;
  percentage?: number;
  negativeOverage?: boolean;
}

export default function NutrientBar({
  value,
  goal,
  name,
  unit,
  percentage,
  negativeOverage = false,
}: NutrientBarProps) {
  const normalizedPercentage = getPercentage();
  const difference = value - goal;
  const underGoal = difference < 0;

  function getPercentage() {
    if (percentage && percentage > 1) {
      return percentage;
    } else if (percentage && percentage <= 1) {
      return percentage * 100;
    } else {
      return (value / goal) * 100;
    }
  }

  return (
    <div>
      <div className="flex justify-between mb-1">
        <p className="font-semibold">{name}</p>
        <p>{`${value} ${unit}`}</p>
      </div>

      <Progress value={normalizedPercentage} />
    </div>
  );
}
