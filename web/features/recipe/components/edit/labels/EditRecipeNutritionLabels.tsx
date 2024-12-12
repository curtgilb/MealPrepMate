"use client";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { nutritionLabelFragment } from "@/features/recipe/api/NutritionLabel";
import {
  EditRecipeProps,
  EditRecipeSubmit,
} from "@/features/recipe/components/edit/RecipeEditor";
import { EditNutritionLabel } from "@/features/recipe/components/nutrition_label/EditNutritionLabel";
import { EditNutritionLabelNutrients } from "@/features/recipe/components/nutrition_label/EditNutritionLabelNutrients";
import { NutritionLabelPreview } from "@/features/recipe/components/nutrition_label/NutritionLabelPreview";
import { useLabelsByGroup } from "@/features/recipe/hooks/useLabelsByGroup";
import { useNutritionLabelForm } from "@/features/recipe/hooks/useNutritionLabelForm";
import { getFragmentData } from "@/gql";
import { forwardRef, useImperativeHandle, useState } from "react";

export const EditRecipeNutritionLabels = forwardRef<
  EditRecipeSubmit,
  EditRecipeProps
>(function EditLabels(props, ref) {
  const [selectedGroup, setSelectedGroup] = useState<string>("default");

  const labels = getFragmentData(
    nutritionLabelFragment,
    props.recipe?.nutritionLabels
  );

  const { groups, selectedLabel } = useLabelsByGroup(
    props.recipe?.nutritionLabels,
    props.recipe?.ingredients,
    selectedGroup
  );
  const { form, saveLabel, nutrientMap } = useNutritionLabelForm({
    label: selectedLabel,
    recipeId: props.recipe?.id ?? "",
    isPrimary: selectedGroup === "default",
    groupId: selectedLabel?.ingredientGroup?.id,
  });

  useImperativeHandle(ref, () => ({
    async submit(postSubmit) {
      // Get the most current form data
      // Submit graphql form
      await saveLabel();
      // postSubmit();
    },
  }));

  return (
    <div className="grid grid-cols-2 gap-20">
      <Form {...form}>
        <form className="space-y-12">
          <div className="space-y-2">
            <Label htmlFor="ingredient_group">Ingredient Group</Label>
            <Select
              onValueChange={async (value) => {
                await saveLabel().then((result) => {
                  if (result) {
                    setSelectedGroup(value);
                  }
                });
              }}
              defaultValue={selectedGroup ?? "default"}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  id="ingredient_group"
                  placeholder="Ingredient Group"
                />
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
          <EditNutritionLabel isDefault={selectedGroup === "default"} />
          <EditNutritionLabelNutrients nutrientMap={nutrientMap} />
        </form>
      </Form>
      <NutritionLabelPreview
        activeLabel={form.watch()}
        otherLabels={
          labels?.filter((label) => label.id !== selectedLabel?.id) ?? []
        }
      />
    </div>
  );
});
