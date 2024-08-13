import { graphql } from "@/gql";

const getCoursesQuery = graphql(`
  query getCourses($search: String) {
    courses(searchString: $search) {
      id
      name
    }
  }
`);

const createCourseMutation = graphql(`
  mutation createCourse($name: String!) {
    createCourse(name: $name) {
      id
      name
    }
  }
`);

export { createCourseMutation, getCoursesQuery };
