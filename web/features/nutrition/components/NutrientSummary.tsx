import { NutrientFieldsFragment } from "@/gql/graphql";
import { Progress } from "../../../components/ui/progress";

interface NutrientSummaryProps {
  id: string;
  name: string;
  target?: number;
  value: number;
  unit: string;
  childNutrients: NutrientFieldsFragment[];
  childLookup: { [key: string]: NutrientFieldsFragment[] };
  values: { [key: string]: number };
}

export function NutrientSummaryCard({
  name,
  id,
  target,
  unit,
  value,
  childLookup,
  values,
}: NutrientSummaryProps) {
  const numbers = target ? `${value} / ${target} ${unit}` : `${value} ${unit}`;
  const children = id in childLookup ? childLookup[id] : [];
  const percentage = target
    ? Math.floor(value / target)
    : value !== 0
    ? 100
    : 0;
  return (
    <div>
      <div className="flex justify-between">
        <p>{name}</p>
        <p>{numbers}</p>
      </div>
      <Progress value={percentage} />
      {children.length > 0 && (
        <div className="ps-4">
          {children.map((child) => {
            const childValue = child.id in values ? values[child.id] : 0;
            const children =
              child.id in childLookup ? childLookup[child.id] : [];
            return (
              <NutrientSummaryCard
                key={child.id}
                name={child.name}
                id={child.id}
                target={child.customTarget ?? undefined}
                unit={child.unit.symbol ?? ""}
                value={childValue}
                childNutrients={children}
                childLookup={childLookup}
                values={values}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
