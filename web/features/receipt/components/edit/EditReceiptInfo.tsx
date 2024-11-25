import { useForm } from "react-hook-form";
import { z } from "zod";

import { GenericCombobox } from "@/components/combobox/GenericCombox1";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getGroceryStoresQuery } from "@/features/ingredient/api/GroceryStore";
import { GetGroceryStoresQuery, GetReceiptQuery } from "@/gql/graphql";
import { zodResolver } from "@hookform/resolvers/zod";

interface EditRecipeInfoProps {
  receipt: GetReceiptQuery["receipt"];
}

const receiptInputSchema = z.object({
  date: z.date(),
  store: z.object({ id: z.string(), name: z.string() }),
});

export function EditReceiptInfo({ receipt }: EditRecipeInfoProps) {
  const form = useForm<z.infer<typeof receiptInputSchema>>({
    resolver: zodResolver(receiptInputSchema),
    defaultValues: {
      store: receipt.matchingStore ?? undefined,
      date: receipt.date ? new Date(receipt.date) : new Date(),
    },
  });

  function renderStore(
    store: GetGroceryStoresQuery["stores"]["edges"][number]["node"]
  ) {
    return {
      id: store.id,
      name: store.name,
      label: store.name,
    };
  }

  function updateReceipt(values: z.infer<typeof receiptInputSchema>) {}

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
                <GenericCombobox
                  query={getGroceryStoresQuery}
                  variables={{}}
                  unwrapDataList={(data) => data?.stores.edges ?? []}
                  renderItem={({
                    node: store,
                  }: GetGroceryStoresQuery["stores"]["edges"][number]) =>
                    renderStore(store)
                  }
                  selectedItems={
                    field.value ? [renderStore(field.value)] : undefined
                  }
                  onChange={(store) => {
                    field.onChange(store[0]);
                  }}
                  multiSelect={false}
                  autoFilter={false}
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
