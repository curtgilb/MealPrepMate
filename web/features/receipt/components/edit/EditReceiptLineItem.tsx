"use client";
import { useFormContext } from "react-hook-form";
import { z } from "zod";

import { getUnitsQuery } from "@/api/Unit";
import { GenericCombobox } from "@/components/combobox/GenericCombox1";
import { Hint } from "@/components/Hint";
import { Button } from "@/components/ui/button";
import {
  FormControl,
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
import { editReceiptItem } from "@/features/receipt/api/Receipt";
import { EditReceiptForm } from "@/features/receipt/components/edit/EditReceipt";
import {
  FetchUnitsQuery,
  FoodType,
  GetIngredientsQuery,
  ReceiptItemFragment as ReceiptItemType,
} from "@/gql/graphql";
import { toTitleCase } from "@/utils/utils";
import { useMutation } from "@urql/next";

interface EditReceiptLineItemProps {
  advance: () => void;
  item: ReceiptItemType | null | undefined;
}

export const receiptItemFormSchema = z.object({
  totalPrice: z.coerce.number().nonnegative(),
  description: z.string(),
  quantity: z.coerce.number().nonnegative(),
  perUnitPrice: z.coerce.number().nonnegative(),
  unitQuantity: z.coerce.number().nonnegative(),
  unit: z.object({ id: z.string(), label: z.string() }).nullish(),
  ingredient: z.object({ id: z.string(), label: z.string() }).nullish(),
  foodType: z.nativeEnum(FoodType).optional(),
  ignore: z.boolean(),
});

type ReceiptItemFormValues = z.infer<typeof receiptItemFormSchema>;

export function getLineItemDefaultValues(
  item: ReceiptItemType | null | undefined
) {
  return {
    totalPrice: item?.totalPrice ?? 0,
    description: item?.description ?? "",
    quantity: item?.quantity ?? 1,
    perUnitPrice: item?.perUnitPrice ?? 0,
    unitQuantity: item?.unitQuantity ?? 0,
    unit: item?.matchingUnit
      ? { id: item.matchingUnit.id, label: item.matchingUnit.name }
      : undefined,
    ingredient: item?.matchingIngredient
      ? { id: item.matchingIngredient.id, label: item.matchingIngredient.name }
      : undefined,
    foodType: item?.foodType ?? undefined,
    ignore: item?.ignore ?? false,
  };
}

export function EditReceiptLineItem({
  item,
  advance,
}: EditReceiptLineItemProps) {
  const [itemResult, editItem] = useMutation(editReceiptItem);

  const form = useFormContext<EditReceiptForm>();

  async function onSubmit(ignore: boolean) {
    // console.log("Cleaned values", values);
    // const { id, unit, ingredient, ...rest } = values;
    // await editItem({
    //   lineId: values.id,
    //   lineItem: { ...rest, unitId: unit?.id, ingredientId: ingredient?.id },
    // }).then((result) => {
    //   advance();
    // });
  }

  return (
    <fieldset>
      <legend className="font-serif text-xl mb-4">Edit line item</legend>
      <div className="flex gap-6 items-start mb-8">
        <FormField
          control={form.control}
          name="item.ingredient"
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
          name="item.quantity"
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
          name="item.totalPrice"
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
          name="item.unitQuantity"
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
          name="item.unit"
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
          name="item.foodType"
          render={({ field }) => (
            <FormItem className="flex flex-col justify-start">
              <FormLabel>Food Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl className="min-w-36">
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
          variant="outline"
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await onSubmit(true);
          }}
        >
          Ignore Item
        </Button>
        <Button
          variant="secondary"
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await onSubmit(false);
          }}
        >
          Verify & continue
        </Button>
      </div>
    </fieldset>
  );
}
