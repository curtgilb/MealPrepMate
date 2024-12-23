"use client";

import { Button } from "@/components/ui/button";
import { receiptItemFragment } from "@/features/receipt/api/Receipt";
import { EditReceiptInfo } from "@/features/receipt/components/edit/EditReceiptInfo";
import {
  EditReceiptLineItem,
  getLineItemDefaultValues,
  receiptItemFormSchema,
} from "@/features/receipt/components/edit/EditReceiptLineItem";
import { EditReceiptProgress } from "@/features/receipt/components/edit/EditReceiptProgress";
import { ReceiptLineItems } from "@/features/receipt/components/edit/ReceiptLineItems";
import { ZoomableImage } from "@/features/receipt/components/edit/ZoomableImage";
import { getFragmentData } from "@/gql";
import { GetReceiptQuery, ReceiptItemFragment } from "@/gql/graphql";
import { useReceiptItems } from "@/hooks/use-receipt-items";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { useEffect } from "react";

interface EditReceiptProps {
  receipt: GetReceiptQuery["receipt"];
}

const receiptInputSchema = z.object({
  date: z.date(),
  store: z.object({ id: z.string(), name: z.string() }),
  item: receiptItemFormSchema,
});
export type EditReceiptForm = z.infer<typeof receiptInputSchema>;

function getDefaultValues(
  receipt: GetReceiptQuery["receipt"],
  activeItem: ReceiptItemFragment | null
) {
  return {
    date: receipt?.date ?? new Date().toDateString(),
    store: receipt?.matchingStore ?? undefined,
    item: getLineItemDefaultValues(activeItem),
  };
}

export function EditReceipt({ receipt }: EditReceiptProps) {
  const lineItems = getFragmentData(receiptItemFragment, receipt.items);
  const { activeItem, setActive, sortedItems, advance } = useReceiptItems(
    receipt.id,
    lineItems
  );

  const allVerified = lineItems?.every((item) => item.verified);

  function updateReceipt(values: z.infer<typeof receiptInputSchema>) {}

  const form = useForm<z.infer<typeof receiptInputSchema>>({
    resolver: zodResolver(receiptInputSchema),
    defaultValues: getDefaultValues(receipt, activeItem),
  });

  useEffect(() => {
    form.resetField("item", {
      defaultValue: getLineItemDefaultValues(activeItem),
    });
  }, [activeItem, form]);

  return (
    <div className="flex gap-12">
      <div className="flex gap-6">
        <ZoomableImage
          src={`${process.env.NEXT_PUBLIC_STORAGE_URL}${receipt?.imagePath}`}
          title="Uploaded Receipt"
          alt="Uploaded Receipt"
          width={400}
          height={800}
          highlight={{
            name: activeItem?.description ?? "",
            boxList:
              activeItem?.boundingBoxes?.map((box) => box.coordinates) ?? [],
          }}
        />
        <div>
          <ReceiptLineItems
            activeId={activeItem?.id}
            setActiveId={setActive}
            items={sortedItems ?? []}
          />
        </div>
      </div>

      <div className="flex flex-col justify-between max-w-md w-full">
        <Form {...form}>
          <form
            onSubmit={(e) => {
              form.handleSubmit(updateReceipt)(e);
            }}
            className="flex flex-col gap-10 justify-between"
          >
            <EditReceiptInfo />
            <EditReceiptLineItem item={activeItem} advance={advance} />

            <div className="space-y-4">
              <Button className="w-full" type="submit" disabled={!allVerified}>
                Complete verification
              </Button>
              <EditReceiptProgress items={lineItems ?? []} />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
