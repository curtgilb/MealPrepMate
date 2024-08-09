import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleEllipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";

export type PlanMode = "meal_planning" | "cooking" | "nutrition" | "shopping";

interface ModeDropdownProps {
  mode: PlanMode;
  setMode: Dispatch<SetStateAction<PlanMode>>;
}

export function ModeDropdown({ mode, setMode }: ModeDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <CircleEllipsis className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Views</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={mode}
          onValueChange={(value) => setMode(value as PlanMode)}
        >
          <DropdownMenuRadioItem value="meal_planning">
            Meal Planning
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="cooking">Cooking</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="nutrition">
            Nutrient
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="shopping">
            Shopping
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
