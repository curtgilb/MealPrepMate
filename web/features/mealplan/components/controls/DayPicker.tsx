import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Dispatch, SetStateAction } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type ViewMode = "day" | "week";

interface DayScrollerProps {
  value: number;
  onChange: (value: number) => void;
  view: ViewMode;
  setView: (value: ViewMode) => void;
}

export function DayScroller({
  value,
  onChange,
  view,
  setView,
}: DayScrollerProps) {
  const isDayView = view === "day";
  const week = value <= 7 ? 1 : Math.ceil(value / 7);
  let days = value <= 7 ? value : value - Math.floor(value / 7) * 7;
  days = days === 0 ? 7 : days;
  const canSubtractWeeks = week > 1;
  const canSubtractDays = value > 1;

  return (
    <div className="flex items-center gap-3">
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

        {isDayView && (
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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="min-w-40" variant="outline">
            {isDayView ? `Week ${week} Day ${days}` : `Week ${week}`}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Planning view</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={view}
            onValueChange={(v) => {
              setView(v as "week" | "day");
            }}
          >
            <DropdownMenuRadioItem value="week">Week</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="day">Day</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <div>
        {isDayView && (
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
