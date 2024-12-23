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
import { nutritionFieldsFragment } from "@/features/nutrition/api/Nutrient";
import { nutritionLabelFragment } from "@/features/recipe/api/NutritionLabel";
import {
  EditRecipeProps,
  EditRecipeSubmit,
} from "@/features/recipe/components/edit/RecipeEditor";
import { EditNutritionLabel } from "@/features/recipe/components/nutrition_label/EditNutritionLabel";
import { LabelNutrientFields } from "@/features/recipe/components/nutrition_label/EditNutritionLabelNutrients";
import { NutritionLabelPreview } from "@/features/recipe/components/nutrition_label/NutritionLabelPreview";
import { DEFAULT_GROUP_KEY } from "@/features/recipe/hooks/useGroupedRecipeIngredients";

import { useNutritionLabelForm } from "@/features/recipe/hooks/useNutritionLabelForm";
import { getFragmentData } from "@/gql";
import { forwardRef, useImperativeHandle, useState } from "react";

export const NutritionLabelEditor = forwardRef<
  EditRecipeSubmit,
  EditRecipeProps
>(function NutritionLabelEditor(props, ref) {
  const [selectedGroup, setSelectedGroup] = useState<string>(DEFAULT_GROUP_KEY);

  const labels = getFragmentData(
    nutritionLabelFragment,
    props.recipe?.nutritionLabels
  );

  const selectedLabel = getFragmentData(
    nutritionLabelFragment,
    props.recipe?.nutritionLabels
  )?.find((label) => {
    if (selectedGroup === DEFAULT_GROUP_KEY && !label.ingredientGroup) {
      return true;
    }

    if (selectedGroup === label.ingredientGroup?.id) {
      return true;
    }
    return false;
  });

  const { form, saveLabel, nutrientMap } = useNutritionLabelForm({
    label: selectedLabel,
    recipeId: props.recipe?.id ?? "",
    isPrimary: selectedGroup === DEFAULT_GROUP_KEY,
    groupId: selectedGroup === DEFAULT_GROUP_KEY ? undefined : selectedGroup,
  });

  console.log("label", props.recipe?.nutritionLabels);

  useImperativeHandle(ref, () => ({
    async submit(postSubmit) {
      // Get the most current form data
      // Submit graphql form
      await saveLabel();
      // postSubmit();
    },
  }));

  return (
    <div className="grid grid-cols-2 gap-36">
      <Form {...form}>
        <form className="space-y-12">
          <div className="space-y-2">
            <Label htmlFor="ingredient_group">Ingredient Group</Label>
            <Select
              onValueChange={async (value) => {
                console.log("Value changed");
                await saveLabel().then((result) => {
                  if (result) {
                    setSelectedGroup(value);
                  }
                });

                setSelectedGroup(value);
              }}
              defaultValue={selectedGroup ?? DEFAULT_GROUP_KEY}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  id="ingredient_group"
                  placeholder="Ingredient Group"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={DEFAULT_GROUP_KEY}>Primary</SelectItem>
                {props.recipe?.ingredientGroups &&
                  [...props.recipe.ingredientGroups].map((group) => {
                    return (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    );
                  })}
              </SelectContent>
            </Select>
          </div>
          <EditNutritionLabel isDefault={selectedGroup === DEFAULT_GROUP_KEY} />
          <LabelNutrientFields nutrientMap={nutrientMap} />
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
