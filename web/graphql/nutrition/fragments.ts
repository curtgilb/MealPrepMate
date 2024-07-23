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
      upperLimit
    }
    name
    important
    parentNutrientId
    target {
      id
      nutrientTarget
      preference
      threshold
    }
    type
    unit {
      id
      name
      symbol
      abbreviations
    }
  }
`);
