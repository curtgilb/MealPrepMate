import { graphql } from "@/gql";

const expirationRuleFragment = graphql(`
  fragment ExpirationRuleFields on ExpirationRule {
    id
    name
    variation
    defrostTime
    perishable
    tableLife
    fridgeLife
    freezerLife
  }
`);

const getExpirationRulesQuery = graphql(`
  query GetExpirationRules {
    expirationRules {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ...ExpirationRuleFields
        }
      }
    }
  }
`);

const createExpirationRuleMutation = graphql(
  `
    mutation CreateExpirationRule($input: CreateExpirationRuleInput!) {
      createExpirationRule(rule: $input) {
        ...ExpirationRuleFields
      }
    }
  `
);

const editExpirationRuleMutation = graphql(
  `
    mutation EditExpirationRule($id: ID!, $input: EditExpirationRuleInput!) {
      editExpirationRule(ruleId: $id, expirationRule: $input) {
        ...ExpirationRuleFields
      }
    }
  `
);

const deleteExpirationRuleMutation = graphql(
  `
    mutation DeleteRule($id: ID!) {
      deleteExpirationRule(expirationRuleId: $id) {
        success
        message
      }
    }
  `
);

export {
  expirationRuleFragment,
  getExpirationRulesQuery,
  editExpirationRuleMutation,
  deleteExpirationRuleMutation,
  createExpirationRuleMutation,
};
