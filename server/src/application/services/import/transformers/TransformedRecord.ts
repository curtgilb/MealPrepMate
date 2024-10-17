import { CreateNutritionLabelInput } from "@/application/services/nutrition/NutritionLabelService.js";
import { tagIngredients } from "@/application/services/recipe/RecipeIngredientService.js";
import { CreateRecipeInput } from "@/application/services/recipe/RecipeService.js";
import { MaybePromise } from "@/application/types/CustomTypes.js";

type TransformedRecordData = {
  meta: {
    externalId: string | undefined;
  };
  recipe: CreateRecipeInput;
  label: CreateNutritionLabelInput;
};

type UnwrapArray<T> = T extends (infer U)[]
  ? T | U
  : T extends null | undefined
    ? T
    : T;

export type TransformMapping = {
  [T in keyof TransformedRecordData]: {
    type: T;
    key: keyof TransformedRecordData[T];
    isList?: boolean;
    processValue?: (
      value: unknown,
      key?: string
    ) => MaybePromise<
      UnwrapArray<TransformedRecordData[T][keyof TransformedRecordData[T]]>
    >;
  };
}[keyof TransformedRecordData];

export class TransformedRecord {
  private data: TransformedRecordData = {
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

  getRecipe(includeLabel: boolean) {
    if (includeLabel) {
      return { ...this.data.recipe, nutrition: this.data.label };
    }

    return this.data.recipe;
  }

  getLabel() {
    return this.data.label;
  }

  async addProperty<T extends TransformMapping>(
    map: T,
    origKey: string,
    value: ReturnType<NonNullable<T["processValue"]>>
  ) {
    const processedValue = map?.processValue
      ? await Promise.resolve(map.processValue(value, origKey))
      : value;

    if (processedValue) {
      if (map.isList) {
        if (!Array.isArray(this.data[map.type][map.key])) {
          this.data[map.type][map.key] = [];
        }
        this.data[map.type][map.key].push(processedValue);
      } else {
        this.data[map.type][map.key] = processedValue;
      }
    }
  }

  updatePhotos(origToId: { [key: string]: string }) {
    if (Array.isArray(this.data.recipe.photoIds)) {
      this.data.recipe.photoIds = this.data.recipe.photoIds?.map((old) => {
        if (old in origToId) {
          return origToId[old];
        }
        return old;
      });
    }
  }

  multiplyNutrientsByServings() {
    if (Array.isArray(this.data.label.nutrients)) {
      this.data.label.nutrients = this.data.label.nutrients?.map(
        (nutrient) => ({
          nutrientId: nutrient.nutrientId,
          value: this.data.label.servings * nutrient.value,
        })
      );
    }
  }
}
