import {
  NutritionLabelsInput,
  EditNutritionLabelInput,
  CreateNutritionLabelInput,
} from "../types/gql.js";
import { Prisma, NutritionLabel } from "@prisma/client";
import { db } from "../db.js";

type NutritionLabelQuery = {
  include?: Prisma.NutritionLabelInclude | undefined;
  select?: Prisma.NutritionLabelSelect | undefined;
};

type LabelWithNutrients = Prisma.NutritionLabelGetPayload<{
  include: { nutrients: true };
}>;

async function createNutritionLabel(
  args: NutritionLabelsInput,
  query: NutritionLabelQuery
) {
  // Create base label
  const baseLabel = await db.nutritionLabel.create({
    data: createNutritionLabelStmt(args.baseLabel, true),
    ...query,
  });

  const subLabels: NutritionLabel[] = [];
  if (args.ingredientGroupLabels) {
    for (const label of args.ingredientGroupLabels) {
      subLabels.push(
        await db.nutritionLabel.create({
          data: createNutritionLabelStmt(label, false),
          ...query,
        })
      );
    }
  }
  return [baseLabel, ...subLabels];
}

function getCorrectServings(
  args: EditNutritionLabelInput,
  original: LabelWithNutrients
): number {
  if (
    !Number.isNaN(args.servingsUsed) &&
    original.servingsUsed !== args.servingsUsed
  ) {
    return original.servingsUsed as number;
  } else if (
    !Number.isNaN(args.servings) &&
    original.servings !== args.servings
  ) {
    return original.servings as number;
  } else if (!Number.isNaN(original.servingsUsed)) {
    return original.servingsUsed as number;
  } else if (!Number.isNaN(original.servings)) {
    return original.servings as number;
  } else {
    return 1;
  }
}

async function editNutritionLabels(
  args: EditNutritionLabelInput,
  query: NutritionLabelQuery
) {
  return await db.$transaction(async (tx) => {
    // Get original to see what the original
    const original = await tx.nutritionLabel.findUniqueOrThrow({
      where: { id: args.id },
      include: { nutrients: true },
    });
    const servings = getCorrectServings(args, original);

    // Create statement for updating the base label and creating the new nutrients
    await tx.nutritionLabel.update({
      where: { id: args.id },
      data: createEditLabelStatment(args, servings),
    });

    // create statement for updating nutrients
    if (args.nutrientsToEdit) {
      for (const nutrient of args.nutrientsToEdit) {
        await tx.nutritionLabelNutrient.update({
          where: {
            nutritionLabelId_nutrientId: {
              nutrientId: nutrient.nutrientId,
              nutritionLabelId: args.id,
            },
          },
          data: {
            value: nutrient.value,
            valuePerServing: nutrient.value / servings,
          },
        });
      }
    }
    // Create statement to delete nutrients
    if (args.nutrientsToDeleteIds) {
      for (const id of args.nutrientsToDeleteIds) {
        await tx.nutritionLabelNutrient.deleteMany({
          where: { nutritionLabelId: args.id, nutrientId: id },
        });
      }
    }
    return tx.nutritionLabel.findUniqueOrThrow({
      where: { id: args.id },
      ...query,
    });
  });
}

function createNutritionLabelStmt(
  input: CreateNutritionLabelInput,
  isBaseLabel: boolean
): Prisma.NutritionLabelCreateInput {
  const stmt: Prisma.NutritionLabelCreateInput = {
    name: input.name,
    servings: input.servings,
    servingSize: input.servingSize,
    servingsUsed: input.servingsUsed,
  };

  const servings = [input.servingsUsed, input.servings, 1].filter((serving) => {
    !Number.isNaN(serving);
  })[0];

  if (input.connectingId) {
    if (isBaseLabel) {
      stmt.recipe = { connect: { id: input.connectingId } };
    } else {
      stmt.ingredientGroup = { connect: { id: input.connectingId } };
    }
  }

  if (input.servingSizeUnitId) {
    stmt.servingSizeUnit = { connect: { id: input.servingSizeUnitId } };
  }

  //   Add nutrients
  if (input.nutrients) {
    stmt.nutrients = {
      createMany: {
        data: input.nutrients.map((nutrient) => ({
          nutrientId: nutrient.nutrientId,
          value: nutrient.value,
          valuePerServing: nutrient.value / (servings as number),
        })),
      },
    };
  }

  return stmt;
}

function createEditLabelStatment(
  input: EditNutritionLabelInput,
  servings: number
): Prisma.NutritionLabelUpdateInput {
  const stmt: Prisma.NutritionLabelUpdateInput = {
    name: input.name,
    servings: input.servings,
    servingSize: input.servingSize,
    servingsUsed: input.servingSize,
  };

  if (input.nutrientsToAdd) {
    stmt.nutrients = {
      createMany: {
        data: input.nutrientsToAdd?.map((nutrient) => ({
          nutrientId: nutrient.nutrientId,
          value: nutrient.value,
          valuePerServing: nutrient.value / servings,
        })),
      },
    };
  }

  if (input.servingSizeUnitId) {
    stmt.servingSizeUnit = {
      connect: { id: input.servingSizeUnitId },
    };
  }
  return stmt;
}

export { createNutritionLabel, editNutritionLabels };
