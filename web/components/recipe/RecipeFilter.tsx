import CuisineFilter from "./CuisineFIlter";
import CategoryFilter from "./CategoryFilter";
import CourseFilter from "./CourseFilter";

export default function RecipeFilter() {
  return (
    <div className="p-4">
      <p>Servings</p>
      <p>Prep Time</p>

      <p>Course</p>
      <CourseFilter />
      <p>Cuisine</p>
      <CuisineFilter />
      <p>Category</p>
      <CategoryFilter />
      <p>Ingredients</p>
      <p>Nutrients</p>
    </div>
  );
}
