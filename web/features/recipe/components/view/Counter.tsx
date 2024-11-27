"use client";
import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface CounterProps {
  servings: number;
  step?: number;
  onChange: (servings: number) => void;
}

export function Counter({ servings, step = 1, onChange }: CounterProps) {
  return (
    <div className="flex items-center gap-4">
      <Button
        onClick={() => {
          if (servings > 1) {
            onChange(servings - step);
          }
        }}
        variant="secondary"
        size="icon"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <p className="text-lg font-semibold min-w-10 text-center">{servings}</p>
      <Button
        onClick={() => onChange(servings + step)}
        variant="secondary"
        size="icon"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
