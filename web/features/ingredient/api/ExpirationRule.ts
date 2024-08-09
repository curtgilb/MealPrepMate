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
      ...ExpirationRuleFields
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
    mutation EditExpirationRule($input: EditExpirationRuleInput!) {
      editExpirationRule(expirationRule: $input) {
        ...ExpirationRuleFields
      }
    }
  `
);

const deleteExpirationRuleMutation = graphql(
  `
    mutation DeleteRule($id: String!) {
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
