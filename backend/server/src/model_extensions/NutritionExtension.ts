import {
  EditNutritionLabelInput,
  CreateNutritionLabelInput,
} from "../types/gql.js";
import { Prisma, NutritionLabel } from "@prisma/client";

type NutritionLabelQuery = {
  include?: Prisma.NutritionLabelInclude | undefined;
  select?: Prisma.NutritionLabelSelect | undefined;
};

type LabelWithNutrients = Prisma.NutritionLabelGetPayload<{
  include: { nutrients: true };
}>;

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

function createNutritionLabelStmt(
  input: CreateNutritionLabelInput,
  isBaseLabel: boolean,
  verifed: boolean = false
):
  | Prisma.NutritionLabelCreateInput
  | Prisma.NutritionLabelCreateWithoutRecipeInput {
  const stmt:
    | Prisma.NutritionLabelCreateInput
    | Prisma.NutritionLabelCreateWithoutRecipeInput = {
    name: input.name,
    servings: input.servings,
    servingSize: input.servingSize,
    servingsUsed: input.servingsUsed,
    isPrimary: isBaseLabel,
    verifed,
  };

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
        })),
      },
    };
  }

  if (input.connectingId) {
    if (isBaseLabel) {
      (stmt as Prisma.NutritionLabelCreateInput).recipe = {
        connect: { id: input.connectingId },
      };
    } else {
      stmt.ingredientGroup = { connect: { id: input.connectingId } };
    }
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

export const nutritionExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    model: {
      nutritionLabel: {
        async createNutritionLabel(
          args: CreateNutritionLabelInput,
          query?: NutritionLabelQuery
        ): Promise<NutritionLabel> {
          // Create base label
          const baseLabel = await client.nutritionLabel.create({
            data: createNutritionLabelStmt(args, true),
            ...query,
          });
        },

        async editNutritionLabels(
          args: EditNutritionLabelInput,
          query: NutritionLabelQuery
        ) {
          return await client.$transaction(async (tx) => {
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
        },
      },
    },
  });
});

export { createNutritionLabelStmt };
