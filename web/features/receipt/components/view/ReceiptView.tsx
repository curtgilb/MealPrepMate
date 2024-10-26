"use client";
import { graphql, getFragmentData } from "@/gql";
import { GetReceiptQuery } from "@/gql/graphql";
import { ReceiptItem, ReceiptItemFragment } from "../edit/ReceiptItemEdit";

import { z } from "zod";
import { Progress } from "@/components/ui/progress";
import { useEffect, useMemo, useState } from "react";
import { useReceiptItems } from "@/hooks/use-receipt-items";
import { EditReceipt } from "@/features/receipt/components/edit/ReceiptEdit";

interface ReceiptViewProps {
  receipt: GetReceiptQuery["receipt"];
}

export function ReceiptView({ receipt }: ReceiptViewProps) {
  const items = getFragmentData(ReceiptItemFragment, receipt.items);
  const { index, setIndex, isClient, sortedItems } = useReceiptItems(
    receipt.id,
    items
  );

  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-bold">Receipt Info</h2>
      <EditReceipt receipt={receipt} />
      <div className="flex flex-col gap-4 mb-4">
        <h2 className="text-xl font-bold">Receipt Line Items</h2>
        {isClient && (
          <>
            <div>
              <p>{`Verified ${index + 1} of ${sortedItems?.length}`}</p>
              <Progress
                value={(index - 1 / (sortedItems?.length ?? 1)) * 100}
              />
            </div>
            {sortedItems && (
              <ReceiptItem
                index={index}
                length={sortedItems.length}
                item={sortedItems[index]}
                receiptId={receipt.id}
                setIndex={setIndex}
              ></ReceiptItem>
            )}
          </>
        )}
      </div>
    </div>
  );
}
