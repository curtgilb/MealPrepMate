"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { getUnitsQuery } from "@/api/Unit";
import { GenericCombobox } from "@/components/combobox/GenericCombox1";
import { Hint } from "@/components/Hint";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getIngredientsQuery } from "@/features/ingredient/api/Ingredient";
import {
  editReceiptItem,
  finalizeReceiptMutation,
} from "@/features/receipt/api/Receipt";
import {
  FetchUnitsQuery,
  FoodType,
  GetIngredientsQuery,
  ReceiptItemFragment as ReceiptItemType,
} from "@/gql/graphql";
import { toTitleCase } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@urql/next";

interface EditReceiptLineItemProps {
  advance: () => void;
  item: ReceiptItemType | null | undefined;
}

const receiptItemFormSchema = z.object({
  id: z.string(),
  totalPrice: z.coerce.number().nonnegative(),
  description: z.string(),
  quantity: z.coerce.number().nonnegative(),
  perUnitPrice: z.coerce.number().nonnegative(),
  unitQuantity: z.coerce.number().nonnegative(),
  unit: z.object({ id: z.string(), label: z.string() }).nullish(),
  ingredient: z.object({ id: z.string(), label: z.string() }).nullish(),
  foodType: z.nativeEnum(FoodType).optional(),
});

type ReceiptItemFormValues = z.infer<typeof receiptItemFormSchema>;

function toFormValues(item: ReceiptItemType | null | undefined) {
  return {
    id: item?.id ?? "",
    totalPrice: item?.totalPrice ?? 0,
    description: item?.description ?? "",
    quantity: item?.quantity ?? 0,
    perUnitPrice: item?.perUnitPrice ?? 0,
    unitQuantity: item?.unitQuantity ?? 0,
    unit: item?.matchingUnit
      ? { id: item.matchingUnit.id, label: item.matchingUnit.name }
      : null,
    ingredient: item?.matchingIngredient
      ? { id: item.matchingIngredient.id, label: item.matchingIngredient.name }
      : null,
    foodType: item?.foodType ?? undefined,
  };
}

export function EditReceiptLineItem({
  item,
  advance,
}: EditReceiptLineItemProps) {
  const [itemResult, editItem] = useMutation(editReceiptItem);
  const router = useRouter();

  const form = useForm<ReceiptItemFormValues>({
    resolver: zodResolver(receiptItemFormSchema),
    defaultValues: toFormValues(item),
  });

  useEffect(() => {
    form.reset(toFormValues(item));
  }, [item, form]);

  async function onSubmit(values: ReceiptItemFormValues) {
    console.log("Cleaned values", values);
    const { id, unit, ingredient, ...rest } = values;
    await editItem({
      lineId: values.id,
      lineItem: { ...rest, unitId: unit?.id, ingredientId: ingredient?.id },
    }).then((result) => {
      advance();
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          console.log("form values", form.getValues());
          console.log("Form errors:", form.formState.errors);
          form.handleSubmit(onSubmit)(e);
        }}
        className="flex flex-col gap-6"
      >
        <div className="flex gap-6 items-start">
          <FormField
            control={form.control}
            name="ingredient"
            render={({ field }) => (
              <FormItem className="grow">
                <FormLabel>Matching Ingredient</FormLabel>
                <FormControl className="min-w-52">
                  <GenericCombobox
                    query={getIngredientsQuery}
                    variables={{}}
                    renderItem={(
                      item: GetIngredientsQuery["ingredients"]["edges"][number]
                    ) => {
                      return {
                        id: item.node.id,
                        label: item.node.name,
                      };
                    }}
                    unwrapDataList={(list) => list?.ingredients.edges ?? []}
                    placeholder="Select ingredient"
                    autoFilter={false}
                    multiSelect={false}
                    selectedItems={field.value ? [field.value] : []}
                    onChange={(items) => {
                      console.log(items);
                      if (items.length > 0) {
                        field.onChange(items[0]);
                      } else {
                        field.onChange(null);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Qty</FormLabel>
                <FormControl className="w-20">
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="totalPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Price</FormLabel>
                <FormControl className=" w-28">
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-6 items-start">
          <FormField
            control={form.control}
            name="unitQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex gap-1">
                  Unit Quantity
                  <Hint hint="the total weight or volume of one item. e.g., if you bought 2 gallons of milk, you would put down 1 gallon as the unit quantity." />
                </FormLabel>
                <FormControl className="w-20">
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem className="grow">
                <FormLabel className="flex gap-1">Unit Type</FormLabel>
                <FormControl className="min-w-48 w-full">
                  <GenericCombobox
                    query={getUnitsQuery}
                    variables={{}}
                    renderItem={(item: FetchUnitsQuery["units"][number]) => {
                      return {
                        id: item.id,
                        label: item.name,
                      };
                    }}
                    unwrapDataList={(list) => list?.units ?? []}
                    placeholder="Select unit"
                    autoFilter={true}
                    multiSelect={false}
                    onChange={(units) => {
                      const selectedUnit = units.length > 0 ? units[0] : null;
                      field.onChange(selectedUnit);
                    }}
                    selectedItems={field.value ? [field.value] : []}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="foodType"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-start">
                <FormLabel>Food Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl className="min-w-32">
                    <SelectTrigger>
                      <SelectValue placeholder="Select food type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={FoodType.Canned}>
                      {toTitleCase(FoodType.Canned)}
                    </SelectItem>
                    <SelectItem value={FoodType.Fresh}>
                      {toTitleCase(FoodType.Fresh)}
                    </SelectItem>
                    <SelectItem value={FoodType.Frozen}>
                      {toTitleCase(FoodType.Frozen)}
                    </SelectItem>
                    <SelectItem value={FoodType.Packaged}>
                      {toTitleCase(FoodType.Packaged)}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4 justify-end mt-8">
          <Button
            variant="secondary"
            onClick={() => {
              console.log("Form errors:", form.formState.errors);
            }}
          >
            Ignore Item
          </Button>
          <Button type="submit">Verify & continue</Button>
        </div>
      </form>
    </Form>
  );
}
