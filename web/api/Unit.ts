import { graphql } from "@/gql";

const getUnitsQuery = graphql(`
  query fetchUnits {
    units {
      id
      name
      symbol
    }
  }
`);

const createUnitMutation = graphql(`
  mutation createUnit($unit: CreateUnitInput!) {
    createUnit(input: $unit) {
      id
      name
      symbol
    }
  }
`);

export { getUnitsQuery, createUnitMutation };
