import { z } from 'zod';

import { updateAggregateLabel } from '@/application/services/nutrition/AggregateLabelService.js';
import { db } from '@/infrastructure/repository/db.js';
import { Prisma } from '@prisma/client';

const nutrientValidation = z.object({
  nutrientId: z.string().uuid(),
  value: z.number().positive(),
});

export const nutritionLabelValidation = z.object({
  servings: z.number().nonnegative(),
  servingSize: z.number().nonnegative().nullish(),
  servingSizeUnitId: z.string().uuid().nullish(),
  servingsUsed: z.number().nonnegative().nullish(),
  isPrimary: z.boolean(),
  nutrients: nutrientValidation.array().nullish(),
  ingredientGroupId: z.string().uuid().nullish(),
});

type NutrientInput = {
  nutrientId: string;
  value: number;
};

type NutritionLabelInput = {
  servings: number;
  servingSize?: number | undefined | null;
  servingSizeUnitId?: string | undefined | null;
  servingsUsed?: number | undefined | null;
  isPrimary: boolean;
  nutrients?: NutrientInput[] | undefined | null;
  ingredientGroupId?: string | undefined | null;
  recipeId?: string | undefined | null;
};

type NutritionLabelQuery = {
  include?: Prisma.NutritionLabelInclude | undefined;
  select?: Prisma.NutritionLabelSelect | undefined;
};

async function createNutritionLabel(
  label: NutritionLabelInput,
  query?: NutritionLabelQuery
) {
  return await db.$transaction(async (tx) => {
    const createdLabel = await tx.nutritionLabel.create({
      data: {
        servings: label.servings,
        servingSize: label.servingSize,
        servingSizeUnit: label.servingSizeUnitId
          ? { connect: { id: label.servingSizeUnitId } }
          : undefined,
        servingsUsed: label.servingsUsed,
        isPrimary: label.isPrimary,
        recipe: label.recipeId
          ? { connect: { id: label.recipeId } }
          : undefined,
        nutrients: label.nutrients
          ? {
              createMany: {
                data: label.nutrients.map((nutrient) => ({
                  nutrientId: nutrient.nutrientId,
                  value: nutrient.value,
                })),
              },
            }
          : undefined,
        ingredientGroup: label.ingredientGroupId
          ? { connect: { id: label.ingredientGroupId } }
          : undefined,
      },
    });

    if (label.recipeId) {
      await updateAggregateLabel(label.recipeId, undefined, tx);
    }

    return await tx.nutritionLabel.findUniqueOrThrow({
      where: { id: createdLabel.id },
      ...query,
    });
  });
}

async function editNutritionLabel(
  labelId: string,
  label: NutritionLabelInput,
  query?: NutritionLabelQuery
) {
  return await db.$transaction(async (tx) => {
    await tx.nutritionLabelNutrient.deleteMany({
      where: { nutritionLabelId: labelId },
    });

    const editedLabel = await tx.nutritionLabel.update({
      where: { id: labelId },
      data: {
        servings: label.servings,
        servingSize: label.servingSize,
        servingSizeUnit: label.servingSizeUnitId
          ? { connect: { id: label.servingSizeUnitId } }
          : undefined,
        servingsUsed: label.servingsUsed,
        isPrimary: label.isPrimary === null ? false : label.isPrimary,
        recipe: label.recipeId
          ? { connect: { id: label.recipeId } }
          : undefined,
        nutrients: label.nutrients
          ? {
              createMany: {
                data: label.nutrients.map((nutrient) => ({
                  nutrientId: nutrient.nutrientId,
                  value: nutrient.value,
                })),
              },
            }
          : undefined,
        ingredientGroup: label.ingredientGroupId
          ? { connect: { id: label.ingredientGroupId } }
          : undefined,
      },
    });

    if (editedLabel.recipeId) {
      await updateAggregateLabel(editedLabel.recipeId, undefined, tx);
    }

    return await tx.nutritionLabel.findUniqueOrThrow({
      where: { id: editedLabel.id },
      ...query,
    });
  });
}

async function deleteNutritionLabel(labelId: string) {
  await db.nutritionLabel.delete({ where: { id: labelId } });
}

export {
  createNutritionLabel,
  deleteNutritionLabel,
  editNutritionLabel,
  NutrientInput,
  NutritionLabelInput,
};
