"use client";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EditRecipeProps,
  EditRecipeSubmit,
} from "@/features/recipe/components/edit/RecipeEditor";
import {
  EditNutritionLabelForm,
  NutritionForm,
  SaveForm,
} from "@/features/recipe/components/nutrition_label/EditNutritionLabelForm";
import { useLabelsByGroup } from "@/features/recipe/hooks/useLabelsByGroup";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

export type LabelForms = {
  [key: string]: {
    form: NutritionForm;
    // ingredientId => nutrient value for whole recipe
    nutrients: { [key: string]: number };
  };
};

export const EditRecipeNutritionLabels = forwardRef<
  EditRecipeSubmit,
  EditRecipeProps
>(function EditLabels(props, ref) {
  const formRef = useRef<SaveForm>(null);
  const [selectedGroup, setSelectedGroup] = useState<string>("default");
  const [savedForms, setSavedForms] = useState<LabelForms>({});
  const { groups, selectedLabel } = useLabelsByGroup(
    props.recipe?.nutritionLabels,
    props.recipe?.ingredients,
    selectedGroup
  );
  const selectedForm = savedForms[selectedGroup];

  useImperativeHandle(ref, () => ({
    async submit(postSubmit) {
      // Get the most current form data
      // Submit graphql form
      postSubmit();
    },
  }));

  async function saveForm() {
    if (formRef.current) {
      const formData = await formRef.current.getFormData();
      if (formData) {
        const { groupId, form, nutrients } = formData;

        setSavedForms((prev) => {
          return {
            ...prev,
            [groupId]: {
              form,
              nutrients,
            },
          };
        });
        return true;
      }
    }
    return false;
  }

  return (
    <div>
      <div>
        <Label htmlFor="ingredient_group">Ingredient Group</Label>
        <Select
          onValueChange={(value) => {
            saveForm().then((result) => {
              if (result) {
                setSelectedGroup(value);
              }
            });
          }}
          defaultValue={selectedGroup ?? "default"}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue id="ingredient_group" placeholder="Ingredient Group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            {groups &&
              [...groups].map(([id, group]) => {
                return (
                  <SelectItem key={id} value={id}>
                    {group}
                  </SelectItem>
                );
              })}
          </SelectContent>
        </Select>
      </div>

      <EditNutritionLabelForm
        ref={formRef}
        groupId={selectedGroup}
        label={selectedLabel}
        submittedValues={selectedForm}
      />
    </div>
  );
});
