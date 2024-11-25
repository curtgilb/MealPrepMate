import { CircleHelp } from "lucide-react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface HintProps {
  children: JSX.Element;
}

export function Hint({ children }: HintProps) {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <CircleHelp className="h-3 w-3 cursor-help" />
      </HoverCardTrigger>
      <HoverCardContent>{children}</HoverCardContent>
    </HoverCard>
  );
}
