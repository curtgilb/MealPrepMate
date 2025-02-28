import { graphql } from "@/gql";

const getGroceryStoresQuery = graphql(`
  query getGroceryStores($search: String, $after: String, $first: Int) {
    stores(search: $search, after: $after, first: $first) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          name
        }
      }
    }
  }
`);

const createStoreMutation = graphql(`
  mutation createStore($name: String!) {
    createGroceryStore(name: $name) {
      id
      name
    }
  }
`);

export { getGroceryStoresQuery, createStoreMutation };
