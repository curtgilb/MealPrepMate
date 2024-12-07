"use client";
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
    <>
      <p className="font-serif text-xl mb-2">Detected Items</p>
      <ScrollArea className="flex h-[40rem] flex-col gap-6 w-48 ">
        <ol className="flex flex-col text-sm font-light pr-3">
          {items.map((lineItem) => {
            return (
              <li
                key={lineItem.id}
                className={cn(
                  "flex items-center gap-1 py-1 px-2 rounded-md border border-transparent hover:border-gray-600  cursor-pointer ",
                  { "border-gray-600 font-bold": activeId === lineItem.id }
                )}
                onClick={() => setActiveId(lineItem.id)}
              >
                {lineItem.verified ? (
                  <CheckCircle
                    className={cn("w-4 h-4 mr-1 ", "text-primary")}
                  />
                ) : (
                  <Circle className="w-3 h-3 mr-1" />
                )}
                <p
                  className={cn("line-clamp-1", {
                    "line-through": lineItem.ignore,
                  })}
                >
                  {toTitleCase(lineItem.description)}
                </p>
              </li>
            );
          })}
        </ol>
      </ScrollArea>
    </>
  );
}
