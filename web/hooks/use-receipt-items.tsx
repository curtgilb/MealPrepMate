import { useEffect, useMemo, useState } from "react";

import { ReceiptItemFragment } from "@/gql/graphql";

export function useReceiptItems(
  receiptId: string,
  items: readonly ReceiptItemFragment[] | null | undefined
) {
  const [index, setIndex] = useState<number>(() => {
    if (typeof window !== "undefined" && items?.length) {
      const savedId = localStorage.getItem(receiptId);
      const foundIndex = items.findIndex((item) => item.id === savedId);
      if (savedId) {
        return foundIndex !== -1 ? foundIndex : 0;
      }
    }
    return 0;
  });

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

  useEffect(() => {
    if (items?.length && index >= items?.length) {
      setIndex(items.length - 1);
    }
    const activeId = sortedItems?.[index]?.id;
    if (activeId) {
      window.localStorage.setItem(receiptId, activeId);
    }
  }, [receiptId, index, items, sortedItems]);

  const activeItem = useMemo(() => {
    return sortedItems?.[index] ?? null;
  }, [sortedItems, index]);

  const setActive = (id: string) => {
    if (!sortedItems) return;
    const newIndex = sortedItems.findIndex((item) => item.id === id);
    if (newIndex !== -1) {
      setIndex(newIndex);
    }
  };

  function advance() {
    if (sortedItems) {
      const nextItem = sortedItems.findIndex(
        (item, i) => i > index && !item.verified
      );

      if (nextItem !== -1) {
        setIndex(nextItem);
      } else {
        const firstUnverified = sortedItems.findIndex((item) => !item.verified);
        if (firstUnverified !== -1 && firstUnverified <= index) {
          setIndex(firstUnverified);
        } else {
          setIndex((index + 1) % sortedItems.length);
        }
      }
    }
  }

  return { activeItem, setActive, sortedItems, advance };
}
