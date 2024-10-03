"use client";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface ServingsAdjusterProps {
  servings: number;
  onChange: (servings: number) => void;
}

export function ServingsAjuster({ servings, onChange }: ServingsAdjusterProps) {
  return (
    <div className="flex items-center gap-4">
      <Button
        onClick={() => {
          if (servings > 1) {
            onChange(servings - 1);
          }
        }}
        variant="secondary"
        size="icon"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <p className="text-lg font-semibold">{servings}</p>
      <Button
        onClick={() => onChange(servings + 1)}
        variant="secondary"
        size="icon"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
