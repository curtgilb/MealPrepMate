import { graphql } from "@/gql";

export const getNutrientsQuery = graphql(`
  query getNutrients($advanced: Boolean!, $name: String) {
    nutrients(search: $name, advanced: $advanced) {
      ...NutrientFields
    }
  }
`);

export const getNutrientsForPicker = graphql(`
  query searchNutrients($search: String) {
    nutrients(advanced: true, search: $search) {
      id
      name
      unit {
        id
        symbol
      }
      alternateNames
    }
  }
`);

export const getRankedNutrients = graphql(`
  query getRankedNutrients {
    getRankedNutrients {
      id
      name
      unit {
        id
        symbol
      }
      alternateNames
    }
  }
`);
