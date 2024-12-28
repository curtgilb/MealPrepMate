import { builder } from "@/presentation/builder.js";

const offsetPagination = builder.inputType("OffsetPagination", {
  fields: (t) => ({
    offset: t.int({ required: true }),
    take: t.int({ required: true }),
  }),
});

const cursorPagination = builder.inputType("CursorPagination", {
  fields: (t) => ({
    cursor: t.field({ type: "DateTime" }),
    take: t.int(),
  }),
});

function nextPageInfo(
  dataLength: number,
  take: number,
  offset: number,
  totalCount: number
) {
  if (dataLength < take) return { nextOffset: null, itemsRemaining: 0 };
  let nextOffset: number | null = dataLength + offset;
  if (nextOffset >= totalCount) nextOffset = null;
  const itemsRemaining = totalCount - (offset + dataLength);
  return {
    nextOffset,
    itemsRemaining,
  };
}

export { cursorPagination, nextPageInfo, offsetPagination };
