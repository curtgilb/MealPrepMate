import { GraphQLResolveInfo } from "graphql";
import { builder } from "../builder.js";

function checkIfFieldRequested(
  fieldName: string,
  info: GraphQLResolveInfo
): boolean {
  let requestAggregateLabel = false;
  if (
    info &&
    info.fieldNodes &&
    info.fieldNodes[0] &&
    info.fieldNodes[0].selectionSet
  ) {
    for (const field of info.fieldNodes[0].selectionSet.selections) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      if ((field as any).name.value === "aggregateLabel") {
        requestAggregateLabel = true;
        break;
      }
    }
  }
  return requestAggregateLabel;
}
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

export {
  numericalComparison,
  offsetPagination,
  cursorPagination,
  checkIfFieldRequested,
};
