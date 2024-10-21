import { graphql } from "@/gql";

const createMealPlanMutation = graphql(`
  mutation createMealPlan($input: CreateMealPlanInput!) {
    createMealPlan(mealPlan: $input) {
      id
    }
  }
`);

export { createMealPlanMutation };
