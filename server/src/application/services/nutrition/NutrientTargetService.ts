import {
  ALCOHOL_ID,
  CALORIE_ID,
  CARB_ID,
  FAT_ID,
  PROTIEN_ID,
} from "@/application/config.js";
import { db } from "@/infrastructure/repository/db.js";
import {
  DailyReferenceIntake,
  NutrientTarget,
  Prisma,
  TargetPreference,
} from "@prisma/client";

export type NutrientTargetInput = {
  value: number;
  threshold?: number | undefined | null;
  preference: TargetPreference;
};

export type NutrientGoal = {
  nutrientId: string;
  dri?: DailyReferenceIntake;
  target?: NutrientTarget;
};

export type NutritionTargets = {
  calories: NutrientGoal | undefined | null;
  carbs: NutrientGoal | undefined | null;
  fat: NutrientGoal | undefined | null;
  protein: NutrientGoal | undefined | null;
  alcohol: NutrientGoal | undefined | null;
  nutrients: NutrientGoal[];
};

type NutrientWithTargets = Prisma.NutrientGetPayload<{
  include: { target: true; dri: true };
}>;

async function getNutritionTargets(): Promise<NutritionTargets> {
  const healthProfile = await db.healthProfile.findFirst({});
  const currentAge = healthProfile?.yearBorn
    ? new Date().getFullYear() - healthProfile.yearBorn
    : undefined;
  const nutrientsWithTargets = await db.nutrient.findMany({
    where: {
      OR: [
        {
          dri: {
            some: {
              gender: healthProfile?.gender,
              specialCondition: healthProfile?.specialCondition,
              ageMax: { gte: currentAge },
              ageMin: { lte: currentAge },
            },
          },
        },
        {
          target: { is: {} },
        },
      ],
    },
    include: { target: true, dri: true },
  });
  const targetDict = Object.fromEntries(
    nutrientsWithTargets.map((target) => [target.id, target])
  );

  function transform(nutrient: NutrientWithTargets): NutrientGoal {
    return {
      nutrientId: nutrient.id,
      dri: nutrient.dri[0],
      target: nutrient.target ?? undefined,
    };
  }

  return {
    calories: targetDict[CALORIE_ID] && transform(targetDict[CALORIE_ID]),
    carbs: targetDict[CARB_ID] && transform(targetDict[CARB_ID]),
    fat: targetDict[FAT_ID] && transform(targetDict[FAT_ID]),
    protein: targetDict[PROTIEN_ID] && transform(targetDict[PROTIEN_ID]),
    alcohol: targetDict[ALCOHOL_ID] && transform(targetDict[ALCOHOL_ID]),
    nutrients: nutrientsWithTargets.map(transform),
  };
}

async function setNutrientTarget(
  nutrientId: string,
  target: NutrientTargetInput,
  query?: NutrientTarget
) {
  await db.nutrientTarget.upsert({
    where: { nutrientId: nutrientId },
    update: {
      targetValue: target.value,
      preference: target.preference,
      threshold: target.threshold,
    },
    create: {
      targetValue: target.value,
      preference: target.preference,
      threshold: target.threshold,
      nutrient: { connect: { id: nutrientId } },
    },
  });
  return await db.nutrient.findUniqueOrThrow({
    where: { id: nutrientId },
    ...query,
  });
}

export { getNutritionTargets, setNutrientTarget };
