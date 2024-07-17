import { graphql } from "@/gql";

export const nutritionFieldsFragment = graphql(`
  fragment NutrientFields on Nutrient {
    id
    alternateNames
    target {
      id
      nutrientTarget
      preference
      threshold
    }
    dri {
      id
      value
    }
    name
    important
    parentNutrientId
    type
    unit {
      id
      name
      symbol
      abbreviations
    }
  }
`);

export const getNutrientsQuery = graphql(`
  query getNutrients($advanced: Boolean!) {
    nutrients(pagination: { take: 400, offset: 0 }, advanced: $advanced) {
      items {
        ...NutrientFields
      }
    }
  }
`);
