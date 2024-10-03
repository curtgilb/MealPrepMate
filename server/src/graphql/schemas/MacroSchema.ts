import {
  ALCOHOL_ID,
  CALORIE_ID,
  CARB_ID,
  FAT_ID,
  PROTIEN_ID,
} from "../../config.js";
import { db } from "../../db.js";
import { builder } from "../builder.js";

type MacroNumbers = {
  calories: number | undefined | null;
  carbs: number | undefined | null;
  fat: number | undefined | null;
  protein: number | undefined | null;
  alcohol: number | undefined | null;
};

const macroMapping: { [key: string]: keyof MacroNumbers } = {
  [ALCOHOL_ID]: "alcohol",
  [CALORIE_ID]: "calories",
  [CARB_ID]: "carbs",
  [FAT_ID]: "fat",
  [PROTIEN_ID]: "protein",
};

// ============================================ Inputs ==================================
const macroNumbers = builder.objectRef<MacroNumbers>("MacroNumbers").implement({
  fields: (t) => ({
    calories: t.exposeFloat("calories", { nullable: true }),
    carbs: t.exposeFloat("carbs", { nullable: true }),
    fat: t.exposeFloat("fat", { nullable: true }),
    protein: t.exposeFloat("protein", { nullable: true }),
    alcohol: t.exposeFloat("alcohol", { nullable: true }),
  }),
});

// ============================================ Inputs ==================================
const editMacrosInput = builder.inputType("EditMacroTargetsInput", {
  fields: (t) => ({
    calories: t.int(),
    carbs: t.int(),
    fat: t.int(),
    alcohol: t.int(),
    protein: t.int(),
  }),
});

// ============================================ Queries =================================
builder.queryFields((t) => ({
  macroTargets: t.field({
    type: macroNumbers,
    resolve: async (query) => {
      const targets = await db.nutrientTarget.findMany({
        where: { nutrient: { isMacro: true } },
        ...query,
      });

      return targets.reduce(
        (agg, target) => {
          agg[macroMapping[target.nutrientId]] = target.targetValue;
          return agg;
        },
        {
          calories: undefined,
          carbs: undefined,
          fat: undefined,
          alcohol: undefined,
          protein: undefined,
        } as MacroNumbers
      );
    },
  }),
}));

// ============================================ Mutations ===============================
builder.mutationFields((t) => ({
  editMacroTargets: t.prismaField({
    type: ["NutrientTarget"],
    args: {
      targets: t.arg({ type: editMacrosInput, required: true }),
    },
    resolve: async (query, root, args) => {
      const { calories, carbs, protein, fat, alcohol } = args.targets;
      return await db.$transaction([
        db.nutrientTarget.update({
          where: { nutrientId: CALORIE_ID },
          data: { targetValue: calories ?? undefined },
          ...query,
        }),
        db.nutrientTarget.update({
          where: { nutrientId: PROTIEN_ID },
          data: { targetValue: protein ?? undefined },
          ...query,
        }),
        db.nutrientTarget.update({
          where: { nutrientId: CARB_ID },
          data: { targetValue: carbs ?? undefined },
          ...query,
        }),
        db.nutrientTarget.update({
          where: { nutrientId: FAT_ID },
          data: { targetValue: fat ?? undefined },
          ...query,
        }),
        db.nutrientTarget.update({
          where: { nutrientId: ALCOHOL_ID },
          data: { targetValue: alcohol ?? undefined },
          ...query,
        }),
      ]);
    },
  }),
}));
