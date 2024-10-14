import { CreateNutritionLabelInput } from "@/application/services/nutrition/NutritionLabelService.js";
import { CreateRecipeInput } from "@/application/services/recipe/RecipeService.js";

type TransformedRecordData = {
  meta: {
    externalId: string | undefined;
  };
  recipe: CreateRecipeInput;
  label: CreateNutritionLabelInput;
};

type UnwrapArray<T> = T extends (infer U)[] ? U : T;

export type TransformMapping = {
  [T in keyof TransformedRecordData]: {
    type: T;
    key: keyof TransformedRecordData[T];
    isList?: boolean;
    processValue?: (
      value: unknown,
      key?: string
    ) => UnwrapArray<TransformedRecordData[T][keyof TransformedRecordData[T]]>;
  };
}[keyof TransformedRecordData];

export class TransformedRecord {
  data: TransformedRecordData = {
    meta: { externalId: undefined },
    recipe: {
      title: "",
      source: undefined,
      prepTime: 0,
      cookTime: 0,
      marinadeTime: 0,
      directions: undefined,
      notes: undefined,
      photoIds: undefined,
      courseIds: undefined,
      categoryIds: undefined,
      cuisineIds: undefined,
      ingredients: undefined,
      leftoverFridgeLife: 0,
      leftoverFreezerLife: 0,
      nutrition: undefined,
    },
    label: {
      servings: 1,
      servingSize: undefined,
      servingSizeUnitId: undefined,
      servingsUsed: undefined,
      isPrimary: true,
      nutrients: undefined,
      ingredientGroupId: undefined,
    },
  };

  addProperty(map: TransformMapping, value: string | undefined) {
    const processedValue = map?.processValue ? map.processValue(value) : value;
    if (processedValue) {
      this.data[map.type][map.key] = processedValue;
    }
  }

  updatePhotos(origToId: { [key: string]: string }) {
    this.data.recipe.photoIds = this.data.recipe.photoIds?.map((old) => {
      if (old in origToId) {
        return origToId[old];
      }
      return old;
    });
  }

  multiplyNutrientsByServings() {
    this.data.label.nutrients = this.data.label.nutrients?.map((nutrient) => ({
      nutrientId: nutrient.nutrientId,
      value: this.data.label.servings * nutrient.value,
    }));
  }
}
