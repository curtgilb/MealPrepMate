"use client";
import { PickerUnit } from "@/components/pickers/UnitPicker";
import { LabelForms } from "@/features/recipe/components/edit/labels/EditRecipeNutritionLabels";
import { RecipeFieldsFragment } from "@/gql/graphql";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UnitPicker } from "@/components/pickers/UnitPicker";
import { Input } from "@/components/ui/input";
import {
  createContext,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import { RecipeEditNutritionlabel } from "@/features/recipe/components/nutrition_label/RecipeEditNutritionLabel";

export const NutritionContext = createContext<
  (nutrientId: string, value: number) => void
>(() => {});

interface EditNutritionLabelFormProps {
  groupId: string;
  label:
    | NonNullable<RecipeFieldsFragment["nutritionLabels"]>[number]
    | undefined;
  submittedValues: LabelForms[string] | undefined;
}

const NutritionLabelValidation = z.object({
  servings: z.number(),
  servingSize: z.number(),
  servingSizeUnit: z.custom<PickerUnit | null>(),
  servingsUsed: z.number(),
});

export type NutritionForm = z.infer<typeof NutritionLabelValidation>;

type SaveFormInput = {
  groupId: string;
  form: NutritionForm;
  nutrients: { [key: string]: number };
};

export type SaveForm = {
  getFormData: () => Promise<undefined | SaveFormInput>;
};

export const EditNutritionLabelForm = forwardRef<
  SaveForm,
  EditNutritionLabelFormProps
>(({ label, submittedValues, groupId }, ref) => {
  const current = submittedValues ? submittedValues.form : label;
  const servings = current?.servings ? current.servings : 1;
  const form = useForm<z.infer<typeof NutritionLabelValidation>>({
    resolver: zodResolver(NutritionLabelValidation),
    defaultValues: {
      servings,
      servingSize: current?.servingSize ?? 0,
      servingSizeUnit: current?.servingSizeUnit,
      servingsUsed: servings,
    },
  });
  // Initialize nutrients with the original values from the label, overriden by the submitted values
  const [nutrients, setNutrients] = useState<{
    [key: string]: number;
  }>(() => {
    const originalValues = Object.fromEntries(
      Object.values(label?.nutrients ?? {}).map((nutrient) => [
        nutrient.nutrient.id,
        nutrient.value,
      ])
    );
    return { ...originalValues, ...submittedValues?.nutrients };
  });

  const updateNutrients = useCallback((nutrientId: string, value: number) => {
    setNutrients((prev) => ({
      ...prev,
      [nutrientId]: value,
    }));
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      getFormData: () => {
        return form
          .trigger()
          .then((isValid) => {
            if (isValid) {
              return {
                groupId: groupId,
                nutrients,
                form: form.getValues(),
              } as SaveFormInput;
            }
            return undefined;
          })
          .catch(() => {
            return undefined;
          });
      },
    }),
    [form, groupId, nutrients]
  );

  return (
    <div>
      <h1>EditNutritionLabelForm</h1>
      <Form {...form}>
        <form>
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="servings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Servings</FormLabel>
                  <FormControl>
                    <Input
                      className="max-w-20"
                      type="number"
                      placeholder="4"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="servingsUsed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Servings Used</FormLabel>
                  <FormControl>
                    <Input
                      className="max-w-20"
                      type="number"
                      placeholder="2"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center">
            <FormField
              control={form.control}
              name="servingSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serving Size</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="servingSizeUnit"
              render={({ field }) => (
                <FormItem className="max-w-96 flex flex-col">
                  <FormLabel>Unit</FormLabel>
                  <UnitPicker
                    value={field.value}
                    onChange={(unit) => {
                      form.setValue("servingSizeUnit", unit);
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
      <NutritionContext.Provider value={updateNutrients}>
        <RecipeEditNutritionlabel
          nutrients={nutrients}
          servings={form.getValues("servings")}
        />
      </NutritionContext.Provider>
    </div>
  );
});

EditNutritionLabelForm.displayName = "EditNutritionLabelForm";
