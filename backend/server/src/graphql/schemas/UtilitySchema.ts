import { GraphQLResolveInfo } from "graphql";
import { builder } from "../builder.js";

function checkIfFieldRequested(
  fieldName: string,
  info: GraphQLResolveInfo
): boolean {
  let found = false;
  // if (
  //   info &&
  //   info.fieldNodes &&
  //   info.fieldNodes[0] &&
  //   info.fieldNodes[0].selectionSet
  // ) {
  //   let currentSelectionSet = info.fieldNodes[0].selectionSet;
  //   for (const field of info.fieldNodes[0].selectionSet.selections) {
  //   }
  // }
  return found;
}

// function recurseSearch(selectionSet, targetValue: string, found: boolean) {
//   for (const field of selectionSet.selections) {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
//     if ((field as any).name.value === targetValue) {
//       found = true;
//       break;
//     }

//     if (selectionSet) {
//     }
//   }
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

function nextPageInfo(dataLength: number, offset: number, totalCount: number) {
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
  checkIfFieldRequested,
  nextPageInfo,
};
