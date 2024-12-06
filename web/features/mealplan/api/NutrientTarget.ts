import { graphql } from "@/gql";

const nutrientTargetFieldsFragment = graphql(`
  fragment NutrientTargetFields on NutrientGoal {
    nutrientId
    dri {
      id
      upperLimit
      value
    }
    target {
      id
      nutrientTarget
      preference
      threshold
    }
  }
`);

const getNutrientTargets = graphql(`
  query getNutrientTargets {
    nutritionTargets {
      alcohol {
        ...NutrientTargetFields
      }
      fat {
        ...NutrientTargetFields
      }
      calories {
        ...NutrientTargetFields
      }
      carbs {
        ...NutrientTargetFields
      }
      protein {
        ...NutrientTargetFields
      }
      nutrients {
        ...NutrientTargetFields
      }
    }
  }
`);

const setNutritionTarget = graphql(`
  mutation setNutrientTarget($id: ID!, $target: NutrientTargetInput!) {
    setNutritionTarget(nutrientId: $id, target: $target) {
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

export { nutrientTargetFieldsFragment, getNutrientTargets, setNutritionTarget };
