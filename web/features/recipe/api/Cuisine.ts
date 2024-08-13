import { graphql } from "@/gql";

const getCuisinesQuery = graphql(`
  query getCuisines($search: String) {
    cuisines(searchString: $search) {
      id
      name
    }
  }
`);

const createCuisineMutation = graphql(`
  mutation createCuisine($name: String!) {
    createCuisine(name: $name) {
      id
      name
    }
  }
`);

export { getCuisinesQuery, createCuisineMutation };
