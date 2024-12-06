import { db } from '@/infrastructure/repository/db.js';
import { Prisma, TargetPreference } from '@prisma/client';

export type RankedNutrientInput = {
  nutrientId: string;
  rank: number;
};

type NutrientQuery = {
  include?: Prisma.NutrientInclude | undefined;
  select?: Prisma.NutrientSelect | undefined;
};

type DriQuery = {
  include?: Prisma.DailyReferenceIntakeInclude | undefined;
  select?: Prisma.DailyReferenceIntakeSelect | undefined;
};

async function getDriValues(nutrientId: string, query?: DriQuery) {
  const profile = await db.healthProfile.findFirstOrThrow({});
  const age = new Date().getFullYear() - profile.yearBorn;
  return await db.dailyReferenceIntake.findFirst({
    where: {
      nutrientId: nutrientId,
      gender: profile.gender,
      ageMin: { lte: age },
      ageMax: { gte: age },
      specialCondition: profile.specialCondition,
    },
    ...query,
  });
}

async function setRankedNutrients(
  rankedNutrients: RankedNutrientInput[],
  query?: NutrientQuery
) {
  const [deleted, createMany, created] = await db.$transaction([
    db.rankedNutrient.deleteMany({}),
    db.rankedNutrient.createMany({
      data: rankedNutrients.map((ingredient) => ({
        rank: ingredient.rank,
        nutrientId: ingredient.nutrientId,
      })),
    }),
    db.nutrient.findMany({
      where: {
        ranking: { isNot: null },
      },
      orderBy: { ranking: { rank: "desc" } },
      ...query,
    }),
  ]);
  return created;
}

export { setRankedNutrients, getDriValues };
