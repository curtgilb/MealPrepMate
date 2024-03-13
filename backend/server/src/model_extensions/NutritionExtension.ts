import {
  EditNutritionLabelInput,
  CreateNutritionLabelInput,
} from "../types/gql.js";
import { Prisma, NutritionLabel } from "@prisma/client";

type NutritionLabelQuery = {
  include?: Prisma.NutritionLabelInclude | undefined;
  select?: Prisma.NutritionLabelSelect | undefined;
};

interface LabelInput {
  label: CreateNutritionLabelInput;
  recipeId?: string | undefined;
  verifed: boolean;
  createRecipe: boolean;
}

function createNutritionLabelStmt<B extends boolean>(
  input: LabelInput,
  nested: B
): B extends true
  ? Prisma.NutritionLabelCreateWithoutRecipeInput
  : Prisma.NutritionLabelCreateInput;

function createNutritionLabelStmt(
  input: LabelInput,
  nested: boolean
):
  | Prisma.NutritionLabelCreateInput
  | Prisma.NutritionLabelCreateWithoutRecipeInput {
  const { label, recipeId, verifed, createRecipe } = input;
  const stmt:
    | Prisma.NutritionLabelCreateInput
    | Prisma.NutritionLabelCreateWithoutRecipeInput = {
    name: label.name,
    servings: label.servings,
    servingSize: label.servingSize,
    servingsUsed: label.servingsUsed,
    isPrimary: label.isPrimary ?? false,
    verifed,
    servingSizeUnit: label.servingSizeUnitId
      ? { connect: { id: label.servingSizeUnitId } }
      : undefined,
    nutrients:
      label.nutrients && label.nutrients.length > 0
        ? {
            createMany: {
              data: label.nutrients.map((nutrient) => ({
                nutrientId: nutrient.nutrientId,
                value: nutrient.value,
              })),
            },
          }
        : undefined,
  };

  if (label.ingredientGroupId) {
    stmt.ingredientGroup = { connect: { id: label.ingredientGroupId } };
  }
  if (recipeId && !nested) {
    (stmt as Prisma.NutritionLabelCreateInput).recipe = {
      connect: { id: recipeId },
    };
  }

  if (createRecipe) {
    (stmt as Prisma.NutritionLabelCreateInput).recipe = {
      create: { name: label.name ?? "" },
    };
  }

  return nested ? stmt : (stmt as Prisma.NutritionLabelCreateInput);
}

export const nutritionExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    model: {
      nutritionLabel: {
        async createNutritionLabel(
          args: CreateNutritionLabelInput,
          recipeId: string,
          query?: NutritionLabelQuery
        ): Promise<NutritionLabel> {
          return await client.nutritionLabel.create({
            data: createNutritionLabelStmt(
              {
                label: args,
                recipeId,
                verifed: true,
                createRecipe: false,
              },
              false
            ),
            ...query,
          });
        },

        async editNutritionLabel(
          args: EditNutritionLabelInput,
          query: NutritionLabelQuery
        ) {
          return await client.$transaction(async (tx) => {
            // Create statement for updating the base label and creating the new nutrients
            await tx.nutritionLabel.update({
              where: { id: args.id },
              data: {
                name: args.name,
                servings: args.servings,
                servingSize: args.servingSize,
                servingSizeUnit: args.servingSizeUnitId
                  ? { connect: { id: args.servingSizeUnitId } }
                  : undefined,
                servingsUsed: args.servingsUsed,
                isPrimary: args.isPrimary ?? undefined,
                ingredientGroup: args.ingredientGroupId
                  ? { connect: { id: args.ingredientGroupId } }
                  : undefined,
              },
            });

            // create statement for updating nutrients
            if (args.nutrientsToEdit) {
              for (const nutrient of args.nutrientsToEdit) {
                await tx.nutritionLabelNutrient.update({
                  where: {
                    compoundId: {
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
            if (args.nutrientsToDelete) {
              for (const id of args.nutrientsToDelete) {
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
