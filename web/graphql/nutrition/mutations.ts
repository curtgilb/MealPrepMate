import { graphql } from "@/gql";

export const setRankedNutrients = graphql(
  `
    mutation setRankedNutrients($nutrients: [RankedNutrientInput!]!) {
      setRankedNutrients(nutrients: $nutrients) {
        id
        name
        unit {
          id
          symbol
        }
        alternateNames
      }
    }
  `
);

export const setNutritionTarget = graphql(`
  mutation setNutrientTarget($target: NutrientTargetInput!) {
    setNutritionTarget(target: $target) {
      id
      target {
        id
        nutrientTarget
        preference
        threshold
      }
    }
  }
`);
