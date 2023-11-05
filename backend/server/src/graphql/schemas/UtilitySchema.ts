import { builder } from "../builder.js";

const numericalComparison = builder.inputType("NumericalComparison", {
  fields: (t) => ({
    lte: t.float(),
    eq: t.float(),
    gte: t.float(),
    value: t.int(),
  }),
});

export { numericalComparison };
