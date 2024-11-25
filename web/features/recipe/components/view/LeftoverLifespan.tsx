import { Refrigerator, Snowflake } from "lucide-react";

import { StackedList } from "@/components/StackedList";

interface LeftoverLifespanProps {
  fridge: number | undefined | null;
  freezer: number | undefined | null;
}

export function LeftoverLifespan({ fridge, freezer }: LeftoverLifespanProps) {
  return (
    <StackedList
      items={[
        {
          id: "fridge",
          top: `${fridge ?? "--"} days`,
          bottom: "Fridge Life",
          icon: <Refrigerator className="h-6 w-6 stroke-primary/25" />,
        },
        {
          id: "freezer",
          top: `${freezer ?? "--"} days`,
          bottom: "Freezer Life",
          icon: <Snowflake className="h-6 w-6 stroke-primary/25" />,
        },
      ]}
    />
  );
}
