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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
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
import { graphql } from "@/gql";
import {
  FoodType,
  ReceiptItemFragment as ReceiptItemType,
} from "@/gql/graphql";
import { toTitleCase } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
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

interface ReceiptItem {
  itemNumber: number;
  item: ReceiptItemType;
}

const formSchema = z.object({
  totalPrice: z.number().positive().optional(),
  description: z.string().optional(),
  quantity: z.number().optional(),
  perUnitPrice: z.number().optional(),
  unitQuantity: z.string().optional(),
  unit: z.object({ id: z.string().cuid(), name: z.string() }),
  ingredient: z.object({ id: z.string().cuid(), name: z.string() }),
  foodType: z.nativeEnum(FoodType),
});

export function ReceiptItem({ itemNumber, item }: ReceiptItem) {
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
    console.log(values);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-cols justify-between">
          <div>
            <CardTitle>{toTitleCase(item.description)}</CardTitle>
            <CardDescription>Item {`#${itemNumber}`}</CardDescription>
          </div>
          {/* <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4"></MoreVertical>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-cols gap-4 flex-wrap">
              <FormField
                control={form.control}
                name="ingredient"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Matching Ingredient</FormLabel>
                    <FormControl>
                      {/* <IngredientPicker
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
                      /> */}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Qty</FormLabel>
                    <FormControl>
                      <Input className="w-20" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalPrice"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Total Price</FormLabel>
                    <FormControl>
                      <Input className="w-24" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unitQuantity"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Weight/Volume</FormLabel>
                    <FormControl>
                      <Input className="w-24" type="number" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Weight/Volume Unit</FormLabel>
                    <FormControl>
                      {/* <UnitPicker
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
                      /> */}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="foodType"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
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
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
      {/* <CardFooter>
        <Button>Save and continue</Button>
      </CardFooter> */}
    </Card>
  );
}
