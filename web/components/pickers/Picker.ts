export interface ItemPickerProps<T> {
  select: (selectedItem: T) => void;
  deselect: (deselectedItem: T) => void;
  create: boolean;
  selectedIds: string[];
  placeholder: string;
  multiselect: boolean;
}
