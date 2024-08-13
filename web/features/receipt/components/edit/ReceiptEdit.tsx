import { GroceryStorePicker } from "@/features/receipt/components/GroceryStorePicker";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GetReceiptQuery } from "@/gql/graphql";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface EditRecipeProps {
  receipt: GetReceiptQuery["receipt"];
}

const receiptInputSchema = z.object({
  date: z.date(),
  store: z.object({ id: z.string(), name: z.string() }),
});

export function EditReceipt({ receipt }: GetReceiptQuery) {
  const form = useForm<z.infer<typeof receiptInputSchema>>({
    resolver: zodResolver(receiptInputSchema),
    defaultValues: {
      store: receipt.matchingStore ?? undefined,
      date: receipt.date ? new Date(receipt.date) : new Date(),
    },
  });

  function updateReceipt(values: z.infer<typeof receiptInputSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(updateReceipt)}
        className="flex gap-x-6 mb-8"
      >
        <FormField
          control={form.control}
          name="store"
          render={({ field }) => (
            <FormItem className="flex flex-col w-64">
              <FormLabel>Grocery Store</FormLabel>
              <FormControl>
                <GroceryStorePicker
                  select={(store) => {
                    field.onChange(store);
                  }}
                  deselect={() => {
                    field.onChange(undefined);
                  }}
                  selectedIds={field.value ? [field.value.id] : []}
                  multiselect={false}
                  placeholder={field.value ? field.value.name : "Pick a store"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col w-52">
              <FormLabel>Date</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value}
                  onChange={(newDate) => {
                    console.log(newDate);
                    field.onChange(newDate);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
