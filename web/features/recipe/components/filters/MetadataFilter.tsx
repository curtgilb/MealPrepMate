import { getCategoriesQuery } from "@/features/recipe/api/Category";
import { getCoursesQuery } from "@/features/recipe/api/Course";
import { getCuisinesQuery } from "@/features/recipe/api/Cuisine";
import { CheckboxFilter } from "@/features/recipe/components/filters/CheckboxFilter";
import {
  GetCategoriesQuery,
  GetCoursesQuery,
  GetCuisinesQuery,
} from "@/gql/graphql";

interface MetadataFilterProps {}

export function MetadataFilter() {
  return (
    <div className="flex flex-col gap-8">
      {/* Categories */}
      <CheckboxFilter
        query={getCategoriesQuery}
        render={(item: GetCategoriesQuery["categories"][number]) => ({
          id: item.id,
          label: item.name,
        })}
        getList={(data) => data?.categories}
        selectedIds={[]}
        setSelectedIds={() => {}}
      />
      {/* Courses */}
      <CheckboxFilter
        query={getCoursesQuery}
        render={(item: GetCoursesQuery["courses"][number]) => ({
          id: item.id,
          label: item.name,
        })}
        getList={(data) => data?.courses}
        selectedIds={[]}
        setSelectedIds={() => {}}
      />
      {/* Cuisines */}
      <CheckboxFilter
        query={getCuisinesQuery}
        render={(item: GetCuisinesQuery["cuisines"][number]) => ({
          id: item.id,
          label: item.name,
        })}
        getList={(data) => data?.cuisines}
        selectedIds={[]}
        setSelectedIds={() => {}}
      />
    </div>
  );
}
