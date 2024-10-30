import { ComboboxContent } from "@/components/combobox/ComboboxContent";
import {
  ComboboxItem,
  GenericCombobox,
} from "@/components/combobox/GenericCombox1";
import { getCategoriesQuery } from "@/features/recipe/api/Category";
import { GetCategoriesQuery } from "@/gql/graphql";
import { useState } from "react";

export function CategoryPicker() {
  const [categories, setCategories] = useState<ComboboxItem[]>([]);

  return (
    <GenericCombobox
      query={getCategoriesQuery}
      variables={{ search: "" }}
      unwrapDataList={(query) => {
        return query?.categories;
      }}
      renderItem={(
        item: NonNullable<GetCategoriesQuery["categories"]>[number]
      ) => {
        return { id: item.id, label: item.name };
      }}
      selectedItems={categories}
      onChange={setCategories}
      multiSelect={true}
      autoFilter={true}
    />
  );
}
