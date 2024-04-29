import { PrismaObjectRef } from "@pothos/plugin-prisma";
import { builder } from "../builder.js";
import { FieldRef } from "@pothos/core";

// function checkIfFieldRequested(
//   fieldName: string,
//   info: GraphQLResolveInfo
// ): boolean {
//   let found = false;
//   // if (
//   //   info &&
//   //   info.fieldNodes &&
//   //   info.fieldNodes[0] &&
//   //   info.fieldNodes[0].selectionSet
//   // ) {
//   //   let currentSelectionSet = info.fieldNodes[0].selectionSet;
//   //   for (const field of info.fieldNodes[0].selectionSet.selections) {
//   //   }
//   // }
//   return found;
// }

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
  numericalComparison,
  offsetPagination,
  cursorPagination,
  nextPageInfo,
};
