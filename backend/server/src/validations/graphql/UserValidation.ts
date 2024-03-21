import { Gender, SpecialCondition } from "@prisma/client";
import { z } from "zod";

const profileInputValidation = z.object({
  weight: z.number().positive().lte(1000),
  gender: z.nativeEnum(Gender),
  bodyFatPercentage: z.number().gte(0).lte(1),
  height: z.number().positive().lte(300),
  birthYear: z.number().gte(1900).lte(new Date().getFullYear()),
  specialCondition: z.nativeEnum(SpecialCondition),
  activityLevel: z.number(),
  targetProteinPecentage: z.number().gte(0).lte(1).optional().nullish(),
  targetProteinGrams: z.number().optional().nullish(),
  targetFatPercentage: z.number().gte(0).lte(1).optional().nullish(),
  targetFatGrams: z.number().optional().nullish(),
  targetCarbsPercentage: z.number().gte(0).lte(1).optional().nullish(),
  targetCarbsGrams: z.number().optional().nullish(),
});

export { profileInputValidation };
