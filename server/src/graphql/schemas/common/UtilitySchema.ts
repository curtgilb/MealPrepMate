import { builder } from "@/graphql/builder.js";

const numericalComparison = builder.inputType("NumericalComparison", {
  fields: (t) => ({
    lte: t.int(),
    eq: t.int(),
    gte: t.int(),
  }),
});

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

const deleteResult = builder
  .objectRef<{
    success: boolean;
    message?: string | undefined | null;
  }>("DeleteResult")
  .implement({
    fields: (t) => ({
      success: t.boolean({ resolve: (parent) => parent.success }),
      message: t.string({
        nullable: true,
        resolve: (parent) => parent.message,
      }),
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

export {
  cursorPagination,
  deleteResult,
  nextPageInfo,
  numericalComparison,
  offsetPagination,
};
