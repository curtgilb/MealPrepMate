"use client";
import { graphql } from "@/gql";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useMutation, useQuery } from "@urql/next";

import { TagList } from "../ui/taglist";
import { Category } from "@/gql/graphql";
import { Label } from "../ui/label";
import { Picker } from "../ui/picker";

const getCoursesQuery = graphql(`
  query fetchCourses($search: String) {
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

interface PickerProps {
  selectedItems: string[];
  setSelectedItems: Dispatch<SetStateAction<string[]>>;
}

export function CoursePicker({ selectedItems, setSelectedItems }: PickerProps) {
  const [search, setSearch] = useState<string>();
  const [result, reexecuteQuery] = useQuery({
    query: getCoursesQuery,
    variables: { search: search },
  });
  const [cusineResult, createCuisine] = useMutation(createCourseMutation);
  const { data, fetching, error } = result;
  const fullItems = useMemo(
    () => data?.courses.filter((course) => selectedItems.includes(course.id)),
    [selectedItems, data?.courses]
  );

  function addItem(id: string) {
    setSelectedItems([...selectedItems, id]);
  }

  function removeItem(id: string) {
    setSelectedItems(selectedItems.filter((item) => item !== id));
  }

  return (
    <div className="grid gap-2 mb-4">
      <div className="grid gap-1.5">
        <Label>Courses</Label>
        {data?.courses && (
          <Picker<(typeof data.courses)[0]>
            options={data.courses}
            id="id"
            label="name"
            selectedItems={selectedItems}
            multiselect={true}
            autoFilter={true}
            onSearchUpdate={setSearch}
            addItem={addItem}
            removeItem={removeItem}
            placeholder="Select cuisines"
            createItem={(value: string) => {
              createCuisine({ name: value });
            }}
          />
        )}
      </div>

      {fullItems && (
        <TagList<(typeof fullItems)[0]>
          id="id"
          label="name"
          items={fullItems}
          editable={false}
          removeItem={removeItem}
        />
      )}
    </div>
  );
}
