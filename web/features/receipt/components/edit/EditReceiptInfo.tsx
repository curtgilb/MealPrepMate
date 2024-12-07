import { useFormContext } from "react-hook-form";

import { GenericCombobox } from "@/components/combobox/GenericCombox1";
import { DatePicker } from "@/components/ui/date-picker";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getGroceryStoresQuery } from "@/features/ingredient/api/GroceryStore";
import { EditReceiptForm } from "@/features/receipt/components/edit/EditReceipt";
import { GetGroceryStoresQuery, GetReceiptQuery } from "@/gql/graphql";

function renderStore(
  store: GetGroceryStoresQuery["stores"]["edges"][number]["node"]
) {
  return {
    id: store.id,
    name: store.name,
    label: store.name,
  };
}

export function EditReceiptInfo() {
  const form = useFormContext<EditReceiptForm>();

  return (
    <fieldset className="space-y-4">
      <legend className="font-serif text-xl">Recipe Info</legend>
      <div className="flex gap-6">
        <FormField
          control={form.control}
          name="store"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full grow">
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
            <FormItem className="flex flex-col">
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
      </div>
    </fieldset>
  );
}
