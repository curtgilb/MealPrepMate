import { updateAggregateLabel } from "@/application/services/nutrition/AggregateLabelService.js";
import { AllowUndefinedOrNull } from "@/features/recipe/RecipeService.js";
import { db } from "@/infrastructure/repository/db.js";
import { Prisma } from "@prisma/client";

export type CreateNutrientInput = {
  nutrientId: string;
  value: number;
};

export type CreateNutritionLabelInput = {
  servings: number;
  servingSize: number | undefined | null;
  servingSizeUnitId: string | undefined | null;
  servingsUsed: number | undefined | null;
  isPrimary: boolean;
  nutrients: CreateNutrientInput[] | undefined | null;
  ingredientGroupId: string | undefined | null;
};

export type EditNutritionLabelInput =
  AllowUndefinedOrNull<CreateNutritionLabelInput> & {
    recipeId: string | null | undefined;
  };

type NutritionLabelQuery = {
  include?: Prisma.NutritionLabelInclude | undefined;
  select?: Prisma.NutritionLabelSelect | undefined;
};

async function createNutritionLabel(
  label: CreateNutritionLabelInput,
  recipeId: string | undefined = undefined,
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
        recipe: recipeId ? { connect: { id: recipeId } } : undefined,
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

    if (recipeId) {
      await updateAggregateLabel(recipeId, undefined, tx);
    }

    return await tx.nutritionLabel.findUniqueOrThrow({
      where: { id: createdLabel.id },
      ...query,
    });
  });
}

async function editNutritionLabel(
  labelId: string,
  label: EditNutritionLabelInput,
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

export { createNutritionLabel, deleteNutritionLabel, editNutritionLabel };
