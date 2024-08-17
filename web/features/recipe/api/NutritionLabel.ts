import { graphql } from "@/gql";

const editNutritionLabelMutation = graphql(`
  mutation editNutritionLabel($label: EditNutritionLabelInput!) {
    editNutritionLabel(label: $label) {
      id
      recipe {
        id
      }
      servings
      servingSize
      servingSizeUnit {
        id
        name
        symbol
      }
      servingsUsed
      isPrimary
      nutrients {
        nutrient {
          id
        }
        value
      }
    }
  }
`);
