import { builder } from "@/graphql/builder.js";
import { db } from "@/infrastructure/repository/db.js";
import {
  IngredientFilter,
  MacroFilter,
  NumericalFilter,
  NutrientFilter,
  RecipeFilter,
} from "@/infrastructure/repository/extensions/RecipeExtension.js";

// ============================================ Types ===================================

// ============================================ Inputs ==================================

const numericalComparison = builder
  .inputRef<NumericalFilter>("NumericalFilter")
  .implement({
    fields: (t) => ({
      lte: t.int(),
      equals: t.int(),
      gte: t.int(),
    }),
  });

const nutritionFilter = builder
  .inputRef<NutrientFilter>("NutritionFilter")
  .implement({
    fields: (t) => ({
      nutrientId: t.string({ required: true }),
      perServing: t.boolean({ required: true }),
      target: t.field({ type: numericalComparison, required: true }),
    }),
  });

const ingredientFilter = builder
  .inputRef<IngredientFilter>("IngredientFilter")
  .implement({
    fields: (t) => ({
      ingredientId: t.string({ required: true }),
      amount: t.field({ type: numericalComparison }),
      unitId: t.string(),
    }),
  });

// Filter by nutrient (calroies or any nutrient per serving or per recipe)
// Filter by ingredient
const recipeFilter = builder.inputRef<RecipeFilter>("RecipeFilter").implement({
  fields: (t) => ({
    searchTerm: t.string({ required: false }), // Searches recipe titles
    numOfServings: t.field({ type: numericalComparison }),
    courseIds: t.stringList({ required: false }),
    cuisineIds: t.stringList({ required: false }),
    categoryIds: t.stringList({ required: false }),
    prepTime: t.field({ type: numericalComparison, required: false }),
    cookTime: t.field({ type: numericalComparison, required: false }),
    marinadeTime: t.field({ type: numericalComparison, required: false }),
    totalPrepTime: t.field({ type: numericalComparison, required: false }),
    leftoverFridgeLife: t.field({ type: numericalComparison, required: false }),
    leftoverFreezerLife: t.field({
      type: numericalComparison,
      required: false,
    }),
    isFavorite: t.boolean({ required: false }),
    caloriePerServing: t.field({ type: numericalComparison, required: false }),
    carbPerServing: t.field({ type: numericalComparison, required: false }),
    fatPerServing: t.field({ type: numericalComparison, required: false }),
    protienPerServing: t.field({ type: numericalComparison, required: false }),
    alcoholPerServing: t.field({ type: numericalComparison, required: false }),
    ingredientFilters: t.field({ type: [ingredientFilter], required: false }),
    nutrientFilters: t.field({ type: [nutritionFilter], required: false }),
    ingredientFreshDays: t.field({
      type: numericalComparison,
      required: false,
    }),
  }),
});

// ============================================ Queries =================================
builder.queryFields((t) => ({
  recipe: t.prismaField({
    type: "Recipe",
    args: {
      recipeId: t.arg.globalID({ required: true }),
    },
    resolve: async (query, root, args) => {
      const recipe = await db.recipe.findUniqueOrThrow({
        where: { id: args.recipeId.id },
        ...query,
      });

      return recipe;
    },
  }),
  recipes: t.prismaConnection({
    type: "Recipe",
    cursor: "id",
    edgesNullable: false,
    nodeNullable: false,
    args: {
      filter: t.arg({ type: recipeFilter, required: true }),
    },
    resolve: async (query, root, args) => {
      return await db.recipe.search(args.filter as RecipeFilter, query);
    },
  }),
}));
