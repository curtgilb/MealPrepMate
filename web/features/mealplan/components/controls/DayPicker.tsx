import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
interface DayScrollerProps {
  value: number;
  canScrollDays: boolean;
  onChange: (value: number) => void;
}

export function DayScroller({
  value,
  onChange,
  canScrollDays,
}: DayScrollerProps) {
  const week = value <= 7 ? 1 : Math.ceil(value / 7);
  let days = value <= 7 ? value : value - Math.floor(value / 7) * 7;
  days = days === 0 ? 7 : days;
  const canSubtractWeeks = week > 1;
  const canSubtractDays = value > 1;

  return (
    <div className="flex items-center gap-6">
      <div>
        <Button
          onClick={() => {
            if (canSubtractWeeks) {
              onChange(value - 7);
            }
          }}
          variant="outline"
          size="icon"
          disabled={!canSubtractWeeks}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        {canScrollDays && (
          <Button
            onClick={() => {
              if (canSubtractDays) {
                onChange(value - 1);
              }
            }}
            variant="outline"
            size="icon"
            disabled={!canSubtractDays}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>
      <p>
        <Button className="min-w-40" variant="outline">
          Week {week} {canScrollDays ? `Day ${days}` : null}
        </Button>
      </p>
      <div>
        {canScrollDays && (
          <Button
            onClick={() => {
              onChange(value + 1);
            }}
            variant="outline"
            size="icon"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}

        <Button
          onClick={() => {
            onChange(value + 7);
          }}
          variant="outline"
          size="icon"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
