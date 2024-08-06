import { Progress } from "../../../components/ui/progress";

interface NutrientTargetBarProps {
  name: string;
  symbol: string;
  value: number;
  target: number;
}

export function NutrientTargetBar({
  name,
  symbol,
  value,
  target,
}: NutrientTargetBarProps) {
  const percentage = Math.round((value / target) * 100);

  return (
    <div>
      <div className="flex justify-between">
        <p className="mb-1">{name}</p>
        <p>{`${Math.round(value)} / ${target} ${symbol}`}</p>
      </div>
      <Progress className="h-3" value={percentage} />
    </div>
  );
}
