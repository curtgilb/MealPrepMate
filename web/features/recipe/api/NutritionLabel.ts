import { graphql } from "@/gql";

const nutritionLabelFragment = graphql(`
  fragment NutritionLabelFields on NutritionLabel {
    id
    ingredientGroup {
      id
      name
    }
    isPrimary
    servingSize
    servingSizeUnit {
      id
      name
      symbol
    }
    servings
    servingsUsed
    nutrients {
      value
      nutrient {
        id
      }
    }
  }
`);

const createNutritionLabelMutation = graphql(`
  mutation createNutritionLabel($input: NutritionLabelInput!) {
    createNutritionLabel(nutritionLabel: $input) {
      ...NutritionLabelFields
    }
  }
`);

const editNutritionLabelMutation = graphql(`
  mutation editNutritionLabel($id: ID!, $label: NutritionLabelInput!) {
    editNutritionLabel(id: $id, label: $label) {
      ...NutritionLabelFields
    }
  }
`);

export {
  nutritionLabelFragment,
  createNutritionLabelMutation,
  editNutritionLabelMutation,
};
