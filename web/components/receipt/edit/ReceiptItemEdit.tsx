"use client";
import { IngredientPicker } from "@/components/pickers/IngredientPicker";
import { UnitPicker } from "@/components/pickers/UnitPicker";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { graphql } from "@/gql";
import {
  FoodType,
  ReceiptItemFragment as ReceiptItemType,
} from "@/gql/graphql";
import { toTitleCase } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@urql/next";
import { ChevronLeft, ChevronRight, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const ReceiptItemFragment = graphql(`
  fragment ReceiptItem on ReceiptLine {
    id
    totalPrice
    description
    quantity
    perUnitPrice
    unitQuantity
    foodType
    order
    matchingUnit {
      id
      name
    }
    matchingIngredient {
      id
      name
    }
  }
`);

const editReceiptItem = graphql(
  `
    mutation editReceiptItem($lineId: String!, $lineItem: UpdateReceiptItem!) {
      updateReceiptLine(lineId: $lineId, line: $lineItem) {
        ...ReceiptItem
      }
    }
  `
);

const finalizeReceiptMutation = graphql(`
  mutation finalizeReceipt($receiptId: String!) {
    finalizeReceipt(receiptId: $receiptId) {
      id
      imagePath
      total
      merchantName
      matchingStore {
        id
        name
      }
      date
      items {
        ...ReceiptItem
      }
      scanned
    }
  }
`);

interface ReceiptItem {
  index: number;
  setIndex: Dispatch<SetStateAction<number>>;
  length: number;
  item: ReceiptItemType;
  receiptId: string;
}

const formSchema = z.object({
  totalPrice: z.number().positive().optional(),
  description: z.string().optional(),
  quantity: z.coerce.number().optional(),
  perUnitPrice: z.number().optional(),
  unitQuantity: z.string().optional(),
  unit: z.object({ id: z.string().cuid(), name: z.string() }),
  ingredient: z.object({ id: z.string().cuid(), name: z.string() }),
  foodType: z.nativeEnum(FoodType),
});

export function ReceiptItem({
  index,
  length,
  item,
  setIndex,
  receiptId,
}: ReceiptItem) {
  const [itemResult, editItem] = useMutation(editReceiptItem);
  const [finalizeResult, finalize] = useMutation(finalizeReceiptMutation);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      totalPrice: item.totalPrice ?? undefined,
      description: item.description ?? undefined,
      quantity: item.quantity ?? undefined,
      perUnitPrice: item.perUnitPrice ?? undefined,
      unitQuantity: item.unitQuantity ?? undefined,
      unit: item.matchingUnit ?? undefined,
      ingredient: item.matchingIngredient ?? undefined,
      foodType: item.foodType ?? undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { ingredient, unit, ...rest } = values;
    editItem({
      lineId: item.id,
      lineItem: { ingredientId: ingredient.id, unitId: unit.id, ...rest },
    }).then(() => {
      if (index + 1 < length) {
        setIndex(index + 1);
      } else {
        finalize({ receiptId: receiptId }).then(() => {});
        router.push("/ingredients");
      }
    });
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="mb-2">
          <CardHeader>
            <div className="flex flex-cols justify-between">
              <div>
                <CardTitle>{toTitleCase(item.description)}</CardTitle>
                <CardDescription>Item {`#${index + 1}`}</CardDescription>
              </div>
              <Button variant="outline" size="icon">
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-y-8">
              <div className="flex gap-6 flex-wrap">
                <FormField
                  control={form.control}
                  name="ingredient"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-56">
                      <FormLabel>Matching Ingredient</FormLabel>
                      <FormControl>
                        <IngredientPicker
                          className="w-40"
                          select={(ingredient) => field.onChange(ingredient)}
                          deselect={() => {
                            field.onChange(undefined);
                          }}
                          selectedIds={field.value ? [field.value.id] : []}
                          create={false}
                          multiselect={false}
                          placeholder={
                            field.value ? field.value.name : "Select a match"
                          }
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
                    <FormItem className="flex flex-col w-20">
                      <FormLabel>Qty</FormLabel>
                      <FormControl>
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
                    <FormItem className="flex flex-col w-28">
                      <FormLabel>Total Price</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-6 flex-wrap">
                <FormField
                  control={form.control}
                  name="unitQuantity"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-28">
                      <FormLabel>Unit Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>Weight, volume</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-56">
                      <FormLabel>Unit Type</FormLabel>
                      <FormControl>
                        <UnitPicker
                          select={(unit) => {
                            field.onChange(unit);
                          }}
                          deselect={() => {
                            field.onChange(undefined);
                          }}
                          selectedIds={field.value ? [field.value.id] : []}
                          create={false}
                          placeholder={
                            field.value ? field.value.name : "Pick a unit"
                          }
                          multiselect={false}
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
                    <FormItem className="flex flex-col w-40">
                      <FormLabel>Food Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
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
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-between mt-4">
          <Button
            variant="secondary"
            disabled={index === 0}
            onClick={(e) => {
              e.preventDefault();
              if (index > 0) {
                setIndex(index - 1);
              }
            }}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button type="submit">
            Verify and continue
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
