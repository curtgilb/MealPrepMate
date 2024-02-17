import { builder } from "../builder.js";

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

export { numericalComparison, offsetPagination, cursorPagination };
