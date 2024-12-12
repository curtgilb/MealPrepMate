import {
  createNutritionLabelMutation,
  editNutritionLabelMutation,
} from "@/features/recipe/api/NutritionLabel";
import {
  NutritionLabelFieldsFragment,
  NutritionLabelInput,
} from "@/gql/graphql";
import {
  NutrientWithChildren,
  NutritionDisplayMode,
  UseNutrientResult,
  useNutrients,
} from "@/hooks/use-nutrients";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@urql/next";
import { useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";

const NutritionLabelValidation = z
  .object({
    servings: z.coerce.number(),
    servingSize: z.coerce.number(),
    servingSizeUnit: z.custom<{ id: string; label: string } | null>(),
    servingsUsed: z.coerce.number(),
    isPrimary: z.boolean(),
    nutrients: z
      .object({
        nutrientId: z.string(),
        value: z.coerce.number().nonnegative(),
        index: z.number(),
      })
      .array(),
  })
  .refine((data) => data.isPrimary || data.servingsUsed <= data.servings, {
    path: ["servingsUsed"], // Points to `servingsUsed` in case of an error
    message: "Servings used used cannot exceed total servings.",
  });

export type NutritionFormValues = z.infer<typeof NutritionLabelValidation>;

interface UseNutritionFormProps {
  label: NutritionLabelFieldsFragment | undefined;
  groupId: string | undefined;
  recipeId: string;
  isPrimary: boolean;
}

interface UseNutritionFormResult {
  form: UseFormReturn<NutritionFormValues>;
  saveLabel: () => Promise<boolean>;
  isFetching: boolean;
  nutrientMap: UseNutrientResult["nutrientMap"];
}

export function useNutritionLabelForm({
  label,
  recipeId,
  isPrimary,
  groupId,
}: UseNutritionFormProps): UseNutritionFormResult {
  const { nutrientMap, flattened: nutrients } = useNutrients(
    NutritionDisplayMode.All
  );

  const form = useForm<z.infer<typeof NutritionLabelValidation>>({
    resolver: zodResolver(NutritionLabelValidation),
    defaultValues: toDefaultValues(label, nutrients),
  });

  const [{ fetching: createFetching }, createLabel] = useMutation(
    createNutritionLabelMutation
  );
  const [{ fetching: editFetching }, editLabel] = useMutation(
    editNutritionLabelMutation
  );
  const isFetching = createFetching || editFetching;

  useEffect(() => {
    form.reset(toDefaultValues(label, nutrients));
  }, [label, form, nutrients]);

  function saveLabel() {
    return new Promise<boolean>(async (resolve) => {
      async function submit(values: NutritionFormValues) {
        console.log(values);
        const filteredNutrients = values.nutrients
          .filter((nutrient) => nutrient.value > 0)
          .map((nutrient) => ({
            nutrientId: nutrient.nutrientId,
            value: nutrient.value,
          }));
        const input: NutritionLabelInput = {
          servings: values.servings,
          servingSize: values.servingSize,
          servingSizeUnitId: values.servingSizeUnit?.id,
          recipeId: recipeId,
          ingredientGroupId: groupId,
          servingsUsed: isPrimary ? values.servings : values.servingsUsed,
          isPrimary: isPrimary,
          nutrients: filteredNutrients,
        };

        console.log("submitted values: ", input);

        // create
        if (!label) {
          await createLabel({ input }).then((result) => {
            if (!result.error) resolve(true);
          });
        }
        // edit
        else {
          await editLabel({ label: input, id: label.id }).then((result) => {
            if (!result.error) resolve(true);
          });
        }
        resolve(false);
      }

      form.handleSubmit(submit, () => resolve(false))();
    });
  }

  return { form, saveLabel, isFetching, nutrientMap };
}

function toDefaultValues(
  label: NutritionLabelFieldsFragment | undefined,
  nutrients: NutrientWithChildren[]
) {
  const nutrientValueLookup = label?.nutrients.reduce((lookup, nutrient) => {
    lookup[nutrient.nutrient.id] = nutrient;
    return lookup;
  }, {} as { [key: string]: NutritionLabelFieldsFragment["nutrients"][number] });

  const servings = label?.servings ?? 1;
  return {
    servings,
    servingSize: label?.servingSize ?? 0,
    servingSizeUnit: label?.servingSizeUnit ?? null,
    servingsUsed: label?.isPrimary ? 0 : label?.servingsUsed ?? servings,
    isPrimary: label?.isPrimary,
    nutrients:
      nutrients?.map((nutrient, index) => {
        const lookup = nutrientValueLookup && nutrientValueLookup[nutrient.id];
        return {
          nutrientId: nutrient.id,
          value: lookup?.value ?? 0,
          index,
        };
      }) ?? [],
  };
}
