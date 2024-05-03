import { graphql } from "@/gql";
import { getClient } from "@/ssrGraphqlClient";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const courseQuery = graphql(/* GraphQL */ `
  query getCourses {
    courses {
      id
      name
    }
  }
`);
export default async function CourseFilter() {
  const result = await getClient().query(courseQuery, {});
  return (
    <Collapsible>
      <CollapsibleTrigger>Courses</CollapsibleTrigger>
      <CollapsibleContent>
        <div>
          {result.data?.courses.map((course) => (
            <div key={course.id} className="flex items-center space-x-2">
              <Checkbox id={course.id} />
              <label
                htmlFor={course.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {course.name}
              </label>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
