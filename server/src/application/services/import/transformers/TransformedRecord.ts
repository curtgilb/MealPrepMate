import { CreateRecipeInput } from "@/application/services/recipe/RecipeService.js";
import {
  CreateNutrientInput,
  CreateNutritionLabelInput,
} from "@/application/services/nutrition/NutritionLabelService.js";
import {
  ProcessValueType,
  PropertyMap,
  TargetType,
} from "@/application/services/import/transformers/Transformer.js";

export class TransformedRecord {
  externalId: string | undefined = undefined;
  recipe: CreateRecipeInput = {
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
  };

  label: CreateNutritionLabelInput = {
    servings: 1,
    servingSize: undefined,
    servingSizeUnitId: undefined,
    servingsUsed: undefined,
    isPrimary: true,
    nutrients: undefined,
    ingredientGroupId: undefined,
  };

  addProperty<T extends PropertyMap>(prop: T, value: ProcessValueType<T>) {
    switch (prop.target) {
      case TargetType.Recipe:
        const test = value;
        if ("prop" in prop) {
          this.recipe[prop.prop] = value;
        }
        break;
      case TargetType.Label:
        this.label[prop.prop] = value;
        break;
      case TargetType.Nutrient:
        if (!Array.isArray(this.label.nutrients)) {
          this.label.nutrients = [];
        }
        this.label.nutrients.push(value as CreateNutrientInput);
        break;
    }
  }

  updatePhotos(origToId: { [key: string]: string }) {
    this.recipe.photoIds = this.recipe.photoIds?.map((old) => {
      if (old in origToId) {
        return origToId[old];
      }
      return old;
    });
  }

  multiplyNutrientsByServings() {
    this.label.nutrients = this.label.nutrients?.map((nutrient) => ({
      nutrientId: nutrient.nutrientId,
      value: this.label.servings * nutrient.value,
    }));
  }
}
