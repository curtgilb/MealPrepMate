import { db } from "./db.js";
import { NumericalComparison, RecipeInput } from "./types/gql.js";

const recipe: RecipeInput = {
  title: "Chicken Soup",
  source: ""
  servings: 6,
  ingredients: "1 cup chicken, 2 cups water",
};

// await db.recipe.createRecipe(recipe);

// const data = await db.recipe.findMany({
//   where: { title: { contains: "Chicken", mode: "insensitive" } },
//   include: {
//     ingredients: {
//       include: {
//         ingredient: true,
//       },
//     },
//     nutritionLabel: true,
//   },
// });


const data = await db.recipe.findMany({
  where: {
    title: { contains: "Chicken", mode: "insensitive" },
    course: { some: { id: { in: ["asdfasdf", "adsfasdf"] } } },
    cuisine: { is: { id: "asdfasdf" } },
    category: { some: { id: { in: ["asdfasdf", "adsfasdf"] } } },
    preparationTime: { lte: 5, equals: undefined, gte: 2 },
    cookingTime: { lte: 5, equals: undefined, gte: 2 },
    marinadeTime: { lte: 5, equals: undefined, gte: 2 },
    isFavorite: false,
    isVerified: true,
    nutritionLabel: {
      some: {
        ingredientGroup: null,
        servings: { lte: 5, equals: undefined, gte: 2 },
      },
    },
  },
  include: {
    ingredients: {
      include: {
        ingredient: true,
        unit: true,
      },
    },
    nutritionLabel: {
      include: {
        nutrients: { include: { nutrient: true } },
      },
    },
  },
});

console.log(data);

console.log("hello world");
