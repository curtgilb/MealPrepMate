"use client";

import { useMutation } from "urql";

import {
  finalizeReceiptMutation,
  receiptItemFragment,
} from "@/features/receipt/api/Receipt";
import { EditReceiptInfo } from "@/features/receipt/components/edit/EditReceiptInfo";
import { EditReceiptLineItem } from "@/features/receipt/components/edit/EditReceiptLineItem";
import { EditReceiptProgress } from "@/features/receipt/components/edit/EditReceiptProgress";
import { ReceiptLineItems } from "@/features/receipt/components/edit/ReceiptLineItems";
import { ZoomableImage } from "@/features/receipt/components/edit/ZoomableImage";
import { getFragmentData } from "@/gql";
import { GetReceiptQuery } from "@/gql/graphql";
import { useReceiptItems } from "@/hooks/use-receipt-items";
import { toTitleCase } from "@/utils/utils";

interface ReceiptViewProps {
  receipt: GetReceiptQuery["receipt"];
}

export function EditReceipt({ receipt }: ReceiptViewProps) {
  const [finalizeResult, finalize] = useMutation(finalizeReceiptMutation);
  const lineItems = getFragmentData(receiptItemFragment, receipt.items);
  const { activeItem, setActive, sortedItems, advance } = useReceiptItems(
    receipt.id,
    lineItems
  );

  return (
    <div className="flex gap-12">
      <div className="flex flex-col gap-4 border rounded-md p-4">
        <div className="flex gap-6 items-start ">
          <div className="shrink-0">
            <h2 className="text-xl font-bold font-serif mb-4">Scanned Items</h2>
            <ReceiptLineItems
              activeId={activeItem?.id}
              setActiveId={setActive}
              items={sortedItems ?? []}
            />
          </div>
          <ZoomableImage
            src={`${process.env.NEXT_PUBLIC_STORAGE_URL}${receipt?.imagePath}`}
            title="Uploaded Receipt"
            alt="Uploaded Receipt"
            width={400}
            height={800}
            highlight={
              // Example bounding box
              {
                name: activeItem?.description ?? "",
                boxList:
                  activeItem?.boundingBoxes?.map((box) => box.coordinates) ??
                  [],
              }
            }
          />
        </div>

        <EditReceiptProgress items={sortedItems ?? []} />
      </div>

      <div className="flex flex-col justify-between max-w-md w-full">
        <div>
          <h2 className="text-xl font-bold font-serif mb-4">Receipt Info</h2>
          <EditReceiptInfo receipt={receipt} />

          <h2 className="text-xl font-bold font-serif mb-4">
            Edit {toTitleCase(activeItem?.description)}
          </h2>
          <EditReceiptLineItem item={activeItem} advance={advance} />
        </div>
        <div></div>
      </div>
    </div>
  );
}
