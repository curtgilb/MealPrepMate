import { graphql } from "@/gql";

const nutritionFieldsFragment = graphql(`
  fragment NutrientFields on Nutrient {
    id
    alternateNames
    advancedView
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
    type
    unit {
      id
      name
      symbol
      abbreviations
    }
  }
`);

const getNutrientsQuery = graphql(`
  query getNutrients($advanced: Boolean!, $name: String, $favorites: Boolean) {
    nutrients(search: $name, advanced: $advanced, favorites: $favorites) {
      ...NutrientFields
    }
  }
`);

const searchNutrients = graphql(`
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

const getRankedNutrients = graphql(`
  query getRankedNutrients {
    rankedNutrients {
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

const setRankedNutrients = graphql(
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

export {
  setRankedNutrients,
  getRankedNutrients,
  searchNutrients as getNutrientsForPicker,
  getNutrientsQuery,
  nutritionFieldsFragment,
};
