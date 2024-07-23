import { ReceiptItemFragment } from "@/gql/graphql";
import { useEffect, useMemo, useState } from "react";

export function useReceiptItems(
  receiptId: string,
  items: readonly ReceiptItemFragment[] | null | undefined
) {
  const [isClient, setIsClient] = useState(false);
  const [index, setIndex] = useState<number>(() => {
    // Initialize state from local storage if available
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(receiptId);
      return saved !== null ? Number(saved) : 0;
    }
    return 0;
  });

  useEffect(() => {
    if (items?.length && index >= items?.length) {
      setIndex(items.length - 1);
    }
    window.localStorage.setItem(receiptId, index.toString() ?? "0");
    setIsClient(true);
  }, [receiptId, index, items]);

  const sortedItems = useMemo(() => {
    if (items) {
      return [...items].sort((a, b) => {
        if (a.order === b.order) {
          return 0;
        } else if (a.order === 0) {
          return 1;
        } else if (b.order === 0) {
          return -1;
        } else {
          return a.order - b.order;
        }
      });
    }
  }, [items]);

  return { index, setIndex, isClient, sortedItems };
}
