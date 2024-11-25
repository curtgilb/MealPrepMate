"use client";
import { Pen, PenBox, Save, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "urql";
import { z } from "zod";

import { GenericCombobox } from "@/components/combobox/GenericCombox1";
import { RichTextEditor } from "@/components/rich_text/RichTextEditor";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { expirationRuleFragment } from "@/features/ingredient/api/ExpirationRule";
import {
  createIngredientMutation,
  editIngredientMutation,
  ingredientFieldsFragment,
} from "@/features/ingredient/api/Ingredient";
import { getIngredientCategoryQuery } from "@/features/ingredient/api/IngredientCategory";
import { IngredientAlternateNames } from "@/features/ingredient/components/edit/AlternateNames";
import {
  convertRuleToFormInput,
  expirationRuleSchema,
} from "@/features/ingredient/components/view/EditExpirationRule";
import { ExpirationRule } from "@/features/ingredient/components/view/ExpirationRulePicker";
import { getFragmentData } from "@/gql";
import {
  GetIngredientCategoryQuery,
  IngredientFieldsFragment,
} from "@/gql/graphql";
import { zodResolver } from "@hookform/resolvers/zod";

const ingredientFormSchema = z.object({
  name: z.string(),
  alternateNames: z.string().array(),
  storageInstructions: z.string(),
  category: z
    .object({
      id: z.string(),
      label: z.string(),
    })
    .nullish(),
  expirationRule: expirationRuleSchema.nullable(),
});

export type IngredientFormType = z.infer<typeof ingredientFormSchema>;

interface EditIngredientProps {
  ingredient?: IngredientFieldsFragment | null | undefined;
}

export function IngredientEditor({ ingredient }: EditIngredientProps) {
  const isCreate = !ingredient;
  const router = useRouter();
  const [{ fetching: createFetching }, createIngredient] = useMutation(
    createIngredientMutation
  );
  const [{ fetching: editFetching }, editIngredient] = useMutation(
    editIngredientMutation
  );

  const expirationRule = getFragmentData(
    expirationRuleFragment,
    ingredient?.expiration
  );

  const form = useForm<IngredientFormType>({
    resolver: zodResolver(ingredientFormSchema),
    defaultValues: {
      name: ingredient?.name ?? "",
      alternateNames: ingredient?.alternateNames ?? [],
      storageInstructions: ingredient?.storageInstructions ?? "",
      category:
        ingredient && ingredient.category
          ? { id: ingredient.category.id, label: ingredient.category.name }
          : null,
      expirationRule: expirationRule
        ? convertRuleToFormInput(expirationRule)
        : null,
    },
  });

  async function onSubmit(values: IngredientFormType) {
    const ingredientInput = {
      name: values.name,
      alternateNames:
        values.alternateNames.length > 0 ? values.alternateNames : null,
      storageInstructions: values.storageInstructions ?? null,
      categoryId: values.category?.id ?? null,
      expirationRuleId: values.expirationRule?.id ?? null,
    };

    if (isCreate) {
      await createIngredient({
        input: ingredientInput,
      }).then((createdIngredient) => {
        const id = getFragmentData(
          ingredientFieldsFragment,
          createdIngredient.data?.createIngredient
        )?.id;
        router.push(`/ingredients/${id}`);
      });
    } else {
      await editIngredient({
        id: ingredient?.id,
        input: ingredientInput,
      });
      router.push(`/ingredients/${ingredient?.id}`);
    }
  }

  return (
    <>
      <h2 className="font-serif text-4xl font-extrabold mb-8">
        {ingredient ? `Edit ${ingredient.name}` : "Create new ingredient"}
      </h2>
      <Form {...form}>
        <form
          className="flex flex-col gap-8"
          onSubmit={(e) => {
            console.log("Form state:", form.formState);
            console.log("Form errors:", form.formState.errors);
            console.log("Raw form values:", form.getValues());
            form.handleSubmit(onSubmit)(e);
          }}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="max-w-72 w-full">
                <FormLabel>Ingredient Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="max-w-72 w-full">
                <FormLabel>Ingredient Category</FormLabel>
                <FormControl>
                  <GenericCombobox
                    query={getIngredientCategoryQuery}
                    variables={{}}
                    unwrapDataList={(query) => {
                      return query?.ingredientCategories;
                    }}
                    renderItem={(
                      item: NonNullable<
                        GetIngredientCategoryQuery["ingredientCategories"]
                      >[number]
                    ) => {
                      return { id: item.id, label: item.name };
                    }}
                    selectedItems={field.value ? [field.value] : undefined}
                    onChange={(newValue) => {
                      if (newValue.length > 0) {
                        field.onChange(newValue[0]);
                      } else {
                        field.onChange(null);
                      }
                    }}
                    multiSelect={false}
                    autoFilter={true}
                    placeholder="Select category"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="storageInstructions"
            render={({ field }) => (
              <FormItem className="max-w-prose w-full">
                <FormLabel>Storage Instructions</FormLabel>
                <FormControl>
                  <RichTextEditor
                    value={field.value}
                    onChange={(v) => field.onChange(v)}
                    editable
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <IngredientAlternateNames />

          <ExpirationRule />
          <div className="flex gap-2 mt-8">
            <Button type="submit" disabled={createFetching || editFetching}>
              {isCreate ? (
                <>
                  <PenBox /> Create
                </>
              ) : (
                <>
                  <Save />
                  Save
                </>
              )}
            </Button>
            <Button
              variant="outline"
              asChild
              disabled={createFetching || editFetching}
            >
              <Link
                href={`/ingredients/${ingredient?.id ? ingredient?.id : ""}`}
              >
                <X /> Cancel
              </Link>
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
