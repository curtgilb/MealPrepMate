import { NutritionLabel, Prisma } from "@prisma/client";
import { MatchedLabel } from "../services/import/matchers/LabelMatcher.js";
import { LabelAggregator } from "../services/nutrition/LabelAggregator.js";
import {
  CreateNutritionLabelInput,
  EditNutritionLabelInput,
} from "../types/gql.js";

type NutritionLabelQuery = {
  include?: Prisma.NutritionLabelInclude | undefined;
  select?: Prisma.NutritionLabelSelect | undefined;
};

interface LabelInput {
  label: CreateNutritionLabelInput;
  name?: string;
  recipeId?: string | undefined | null;
  ingredientGroupId?: string | undefined | null;
  verified: boolean;
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
  const { label, recipeId, verified, createRecipe, name } = input;
  const stmt:
    | Prisma.NutritionLabelCreateInput
    | Prisma.NutritionLabelCreateWithoutRecipeInput = {
    servings: label.servings,
    servingSize: label.servingSize,
    servingsUsed: label.servingsUsed,
    isPrimary: label.isPrimary ?? false,
    verified,
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

  // if (label.ingredientGroupId) {
  //   stmt.ingredientGroup = { connect: { id: label.ingredientGroupId } };
  // }
  if (recipeId && !nested) {
    (stmt as Prisma.NutritionLabelCreateInput).recipe = {
      connect: { id: recipeId },
    };
  }

  if (createRecipe && name) {
    (stmt as Prisma.NutritionLabelCreateInput).recipe = {
      create: { name },
    };
  }

  return nested ? stmt : (stmt as Prisma.NutritionLabelCreateInput);
}

export const nutritionExtension = Prisma.defineExtension((client) => {
  async function updateAggregateLabel(recipeId: string) {
    const aggregator = new LabelAggregator(recipeId);
    await aggregator.upsertAggregateLabel();
  }

  return client.$extends({
    model: {
      nutritionLabel: {
        async createNutritionLabel(
          label: CreateNutritionLabelInput,
          recipeId: string | null,
          ingredientGroupId: string | null,
          updateAggregate = true,
          query?: NutritionLabelQuery
        ): Promise<NutritionLabel> {
          const newLabel = await client.nutritionLabel.create({
            data: createNutritionLabelStmt(
              {
                label,
                recipeId,
                ingredientGroupId,
                verified: true,
                createRecipe: false,
              },
              false
            ),
            ...query,
          });

          if (recipeId && updateAggregate) {
            await updateAggregateLabel(recipeId);
          }

          return client.nutritionLabel.findUniqueOrThrow({
            where: { id: newLabel.id },
            ...query,
          });
        },
        async bulkImportLabels(importId: string, labels: MatchedLabel[]) {
          for (const label of labels) {
            let failed = false;

            let draftId;
            try {
              const createdLabel = await client.nutritionLabel.create({
                data: createNutritionLabelStmt(
                  {
                    label: label.label,
                    recipeId: label.recipeMatchId,
                    ingredientGroupId: label.ingredientGroupId,
                    verified: false,
                    name: label.name,
                    createRecipe: label.status === "IMPORTED",
                  },
                  false
                ),
              });
              draftId = createdLabel.id;
            } catch (e) {
              failed = true;
            } finally {
              await client.importRecord.create({
                data: {
                  import: { connect: { id: importId } },
                  hash: label.hash,
                  externalId: label.externalId,
                  name: label.name,
                  parsedFormat: label.label,
                  status: failed ? "FAILED" : label.status,
                  verified: false,
                  recipe: label.recipeMatchId
                    ? { connect: { id: label.recipeMatchId } }
                    : undefined,
                  nutritionLabel: label.labelMatchId
                    ? { connect: { id: label.labelMatchId } }
                    : undefined,
                  ingredientGroup: label.ingredientGroupId
                    ? { connect: { id: label.ingredientGroupId } }
                    : undefined,
                  draftId,
                },
              });
            }
          }
          await client.import.update({
            where: { id: importId },
            data: { status: "REVIEW" },
          });
        },
        async editNutritionLabel(
          args: EditNutritionLabelInput,
          query: NutritionLabelQuery
        ) {
          return await client.$transaction(async (tx) => {
            // Create statement for updating the base label and creating the new nutrients
            const newLabel = await tx.nutritionLabel.update({
              where: { id: args.id },
              data: {
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
            if (
              args.nutrientsToAdd ||
              args.nutrientsToDelete ||
              args.nutrientsToEdit
            ) {
              await updateAggregateLabel(newLabel.recipeId);
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
