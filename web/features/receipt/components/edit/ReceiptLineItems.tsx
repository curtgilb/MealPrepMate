import { CheckCircle, Circle } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReceiptItemFragment } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import { toTitleCase } from "@/utils/utils";

interface ReceiptLineItemsProps {
  activeId: string | null | undefined;
  setActiveId: (id: string) => void;
  items: ReceiptItemFragment[];
}

export function ReceiptLineItems({
  activeId,
  setActiveId,
  items,
}: ReceiptLineItemsProps) {
  return (
    <ScrollArea className="flex h-[648px]  flex-col gap-6 max-w-48 w-full">
      <ol className="flex flex-col text-sm font-light pr-3">
        {items.map((lineItem) => {
          return (
            <li
              key={lineItem.id}
              className={cn(
                "flex items-center gap-1 py-1 px-2 rounded-md border border-transparent hover:border-gray-600  cursor-pointer ",
                activeId === lineItem.id && "border-gray-600 font-bold"
              )}
              onClick={() => setActiveId(lineItem.id)}
            >
              {lineItem.verified ? (
                <CheckCircle className={cn("w-4 h-4 mr-1 ", "text-primary")} />
              ) : (
                <Circle className="w-3 h-3 mr-1" />
              )}
              <p
                className={cn(
                  "line-clamp-1",
                  lineItem.ignore && "line-through"
                )}
              >
                {toTitleCase(lineItem.description)}
              </p>
            </li>
          );
        })}
      </ol>
    </ScrollArea>
  );
}
