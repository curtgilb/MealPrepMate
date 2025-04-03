import "dotenv/config";
import pLimit from "p-limit";
import { uploadPhoto } from "@/application/services/PhotoService.js";
import { tagIngredients } from "@/application/services/recipe/RecipeIngredientService.js";
import { RecipeInput } from "@/application/services/recipe/RecipeService.js";
import { openFileBuffer, readJSON } from "@/infrastructure/file_io/read.js";
import { uploadFile } from "@/infrastructure/object_storage/storage.js";
import { db } from "@/infrastructure/repository/db.js";
import { createRecipe } from "@/application/services/recipe/RecipeService.js";

interface Recipe {
  author: string;
  canonical_url: string;
  category: string;
  cook_time: number;
  cuisine: string;
  description: string;
  equipment: any[];
  host: string;
  image: string;
  ingredient_groups: IngredientGroup[];
  ingredients: string[];
  instructions: string;
  instructions_list: string[];
  keywords: string[];
  language: string;
  prep_time: number;
  ratings: number;
  ratings_count: number;
  site_name: string;
  title: string;
  total_time: number;
  yields: string;
  id: string;
  nutrients: Nutrients;
  ai_meta: AiMeta;
  total_servings: number;
}

interface IngredientGroup {
  ingredients: string[];
  purpose: any;
}

interface Nutrients {
  calories: Amount;
  carbohydrateContent: Amount;
  proteinContent: Amount;
  fatContent: Amount;
  saturatedFatContent: Amount;
  cholesterolContent: Amount;
  sodiumContent: Amount;
  fiberContent: Amount;
  sugarContent: Amount;
}

interface Amount {
  amount: number;
  unit: string;
}

interface AiMeta {
  courses: string[];
  categories: string[];
  can_meal_prep: boolean;
  num_of_servings: number;
  weather: string[];
  season: string[];
  equipment: string[];
  prep_time: number;
  cook_time: number;
  rest_time: number;
  cuisine: string[];
  leftover_freezer_life: number;
  standalone_dish: boolean;
  leftover_fridge_days: number;
}

function getTagId(search: string, searchList: { name: string; id: string }[]) {
  for (const tag of searchList) {
    if (tag.name.toLowerCase().includes(search.toLowerCase())) {
      return tag.id;
    }
  }
  return undefined;
}

const nutrientLookup = {
  calories: "6e0fcef3-ec44-426c-9945-a53737e96c79",
  carbohydrateContent: "0e5a0c1b-0308-4d46-9f46-141e1829e202",
  proteinContent: "bc012bd3-8792-40c1-a2eb-a890600f6677",
  fatContent: "1970c0ef-fc55-49ee-8ee3-228f5e061acb",
  saturatedFatContent: "036b12f3-651f-443a-b716-af604998b9ae",
  cholesterolContent: "71bf849f-dae3-45b2-9d61-41c76d540024",
  sodiumContent: "485b501a-0f5c-4a2e-8abb-b9f3dae79ada",
  fiberContent: "737d014c-219e-45e8-b7a5-3b0b25829a34",
  sugarContent: "3c356ec3-0b13-4ea1-a58e-83949ef0e2cc",
  transFatContent: "b212337c-2a42-4620-a4bb-cbb2a3cbea67",
  unsaturatedFatContent: "2b2c5260-ad52-4aa0-99d7-5a72b0e20c1e",
};

export async function loadRecipes() {
  const recipes = await readJSON<Recipe[]>(
    "/data/test_data/recipes/recipes.json"
  );
  const cuisines = await db.cuisine.findMany({});
  const courses = await db.course.findMany({});
  const cateogories = await db.category.findMany({});

  const limit = pLimit(8); // Limit to 5 concurrent promises
  const insertedRecipes: Promise<unknown>[] = [];

  for (const recipe of recipes) {
    const createTask = limit(async () => {
      try {
        // Upload photo to bucket
        const photo = openFileBuffer(
          `/data/test_data/recipes/images/${recipe.image}`
        );
        const { id } = await uploadPhoto(photo);
        const ingredients = await tagIngredients(
          recipe.ingredients.join("\n"),
          true
        );

        const recipeInput: RecipeInput = {
          title: recipe.title,
          source: recipe.site_name,
          prepTime: recipe.ai_meta.prep_time,
          cookTime: recipe.ai_meta.cook_time,
          marinadeTime: recipe.ai_meta.rest_time,
          directions: recipe.instructions,
          notes: recipe.description,
          photoIds: [id],

          // @ts-ignore
          courseIds: recipe.ai_meta.courses
            .map((course) => getTagId(course, courses))
            .filter((c) => c),

          // @ts-ignore
          categoryIds: recipe.ai_meta.categories
            .map((category) => getTagId(category, cateogories))
            .filter((c) => c),

          // @ts-ignore
          cuisineIds: recipe.ai_meta.cuisine
            .map((cuisine) => getTagId(cuisine, cuisines))
            .filter((c) => c),
          ingredients: ingredients,
          leftoverFridgeLife: recipe.ai_meta.leftover_fridge_days,
          leftoverFreezerLife: recipe.ai_meta.leftover_freezer_life,
          nutrition: {
            servings: recipe.total_servings,
            isPrimary: true,
            nutrients: Object.entries(recipe.nutrients).map(
              ([nutrient, value]) => {
                const nutrientId =
                  nutrientLookup[nutrient as keyof typeof nutrientLookup];
                if (!nutrientId) {
                  console.log(
                    `Nutrient not found: ${nutrient} on recipe ${recipe.id}`
                  );
                }
                return {
                  nutrientId:
                    nutrientLookup[nutrient as keyof typeof nutrientLookup],
                  value: value.amount,
                };
              }
            ),
          },
        };

        return await createRecipe(recipeInput);
      } catch (e) {
        console.log("Error: ", e);
        throw e;
      }
    });

    insertedRecipes.push(createTask);
  }

  await Promise.all(insertedRecipes);
}
