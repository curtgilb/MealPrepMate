import { UnitType } from "@prisma/client";
import { db } from "../../db.js";
import { builder } from "../builder.js";
import { measurementSystem } from "./EnumSchema.js";

const unitType = builder.enumType(UnitType, { name: "UnitType" });

const measurementUnit = builder.prismaObject("MeasurementUnit", {
  name: "MeasurementUnit",
  fields: (t) => ({
    id: t.exposeString("id"),
    name: t.exposeString("name"),
    abbreviations: t.exposeStringList("abbreviations"),
    symbol: t.exposeString("symbol", { nullable: true }),
    conversionName: t.exposeString("conversionName", { nullable: true }),
    measurementSystem: t.field({
      type: measurementSystem,
      nullable: true,
      resolve: (parent) => parent.system,
    }),
    type: t.field({
      type: unitType,
      nullable: true,
      resolve: (parent) => parent.type,
    }),
  }),
});

// const unitQuery = builder
//   .objectRef<{
//     nextOffset: number | null;
//     itemsRemaining: number;
//     items: MeasurementUnit[];
//   }>("UnitQuery")
//   .implement({
//     fields: (t) => ({
//       nextOffset: t.exposeInt("nextOffset", { nullable: true }),
//       itemsRemaining: t.exposeInt("itemsRemaining"),
//       items: t.field({
//         type: [measurementUnit],
//         resolve: (result) => result.items,
//       }),
//     }),
//   });

// ============================================ Inputs ==================================
const createUnitInput = builder.inputType("CreateUnitInput", {
  fields: (t) => ({
    name: t.string({ required: true }),
    abbreviations: t.stringList({ required: true }),
    symbol: t.string(),
    type: t.field({ type: unitType }),
  }),
});

// ============================================ Queries =================================
builder.queryFields((t) => ({
  unit: t.prismaField({
    type: "MeasurementUnit",
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args) => {
      return await db.measurementUnit.findUniqueOrThrow({
        where: { id: args.id },
        ...query,
      });
    },
  }),
  units: t.prismaField({
    type: ["MeasurementUnit"],
    resolve: async (query) => {
      return await db.measurementUnit.findMany({ ...query });
    },
  }),
}));

// ============================================ Mutations =================================
builder.mutationFields((t) => ({
  createUnit: t.prismaField({
    type: "MeasurementUnit",
    args: {
      input: t.arg({ type: createUnitInput, required: true }),
    },
    resolve: async (query, root, args) => {
      return await db.measurementUnit.create({
        data: {
          name: args.input.name,
          abbreviations: args.input?.abbreviations,
          symbol: args.input?.symbol,
          type: args.input?.type,
        },
        ...query,
      });
    },
  }),
}));

export { measurementUnit };
