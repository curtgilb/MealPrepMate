import { builder } from "../builder.js";
import { Prisma } from "@prisma/client";
import { db } from "../../db.js";
import { createRecipe } from "../../extensions/RecipeExtension.js";
import { numericalComparison } from "./UtilitySchema.js";

// ============================================ Types ===================================
builder.prismaObject("Recipe", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("title"),
    prepTime: t.exposeInt("preparationTime", { nullable: true }),
    cookTime: t.exposeInt("cookingTime", { nullable: true }),
    marinadeTime: t.exposeInt("marinadeTime", { nullable: true }),
    notes: t.exposeString("notes", { nullable: true }),
    stars: t.exposeInt("stars", { nullable: true }),
    isFavorite: t.exposeBoolean("isFavorite"),
    leftoverFridgeLife: t.exposeInt("leftoverFridgeLife", { nullable: true }),
    directions: t.exposeString("directions", { nullable: true }),
    isVerified: t.exposeBoolean("isVerified", { nullable: true }),
    cuisine: t.relation("cuisine"),
    category: t.relation("category"),
    course: t.relation("course"),
    ingredients: t.relation("ingredients"),
    photos: t.relation("photos"),
  }),
});

builder.prismaObject("RecipeIngredient", {
  name: "RecipeIngredients",
  fields: (t) => ({
    order: t.exposeInt("order"),
    sentence: t.exposeString("sentence"),
    minQuantity: t.exposeFloat("minQuantity", { nullable: true }),
    maxQuantity: t.exposeFloat("maxQuantity", { nullable: true }),
    quantity: t.exposeFloat("quantity", { nullable: true }),
    unit: t.relation("unit"),
    name: t.exposeString("name", { nullable: true }),
    comment: t.exposeString("comment", { nullable: true }),
    other: t.exposeString("other", { nullable: true }),
    recipes: t.relation("recipe"),
    baseIngredient: t.relation("ingredient", { nullable: true }),
  }),
});

builder.prismaObject("RecipeIngredientGroup", {
  name: "RecipeIngredientGroup",
  fields: (t) => ({
    name: t.exposeString("name"),
    servings: t.exposeInt("servings", { nullable: true }),
    servingsInRecipe: t.exposeInt("servingsInRecipe", { nullable: true }),
    nutritionLabel: t.relation("nutritionLabel", { nullable: true }),
  }),
});
// ============================================ Inputs ==================================
const recipeInput = builder.inputType("RecipeInput", {
  fields: (t) => ({
    title: t.string({ required: true }),
    servings: t.int({ required: true }),
    source: t.string(),
    prepTime: t.int(),
    cookTime: t.int(),
    marinadeTime: t.int({}),
    directions: t.string(),
    notes: t.string(),
    stars: t.int(),
    photoIds: t.stringList(),
    isFavorite: t.boolean(),
    courseIds: t.stringList(),
    categoryIds: t.stringList(),
    cuisineId: t.string(),
    ingredients: t.string(),
    leftoverFridgeLife: t.int(),
    leftoverFreezerLife: t.int(),
  }),
});

const nutritionFilter = builder.inputType("NutritionFilter", {
  fields: (t) => ({
    nutrientID: t.string({ required: true }),
    perServing: t.boolean(),
    target: t.field({ type: numericalComparison }),
  }),
});

const ingredientFilter = builder.inputType("IngredientFilter", {
  fields: (t) => ({
    ingredientID: t.string({ required: true }),
    amount: t.field({ type: numericalComparison }),
    unitId: t.string(),
  }),
});

const recipeFilter = builder.inputType("RecipeFilter", {
  fields: (t) => ({
    // Searches recipe titles, ingredients
    searchString: t.string(),
    numOfServings: t.field({ type: numericalComparison }),
    nutrientFilters: t.field({ type: [nutritionFilter] }),
    ingredientFilter: t.field({ type: [ingredientFilter] }),
  }),
});

// ============================================ Queries =================================
// builder.queryFields((t) => ({
//   recipes: t.prismaField({
//     type: ["Recipe"],
//     args: {
//       filter: t.arg({ type: recipeFilter, required: true }),
//     },
//     resolve: async (query, root, args) => {
//       const filters: Prisma.RecipeWhereInput[] = [];
//       const search: Prisma.RecipeFindManyArgs = {
//         where: {},
//         ...query,
//       };
//       if (args.filter.searchString) {
//         const name: Prisma.RecipeWhereInput = {
//           OR: [
//             {
//               title: {
//                 contains: args.filter.searchString,
//                 mode: "insensitive",
//               },
//             },
//             {
//               ingredients: {
//                 some: {
//                   name: {
//                     contains: args.filter.searchString,
//                     mode: "insensitive",
//                   },
//                 },
//               },
//             },
//           ],
//         };
//         filters.push(name);
//       }

//       if (args.filter.nutrientFilters) {
//         const nutritionFilter: Prisma.NutritionLabelWhereInput[] = [];

//         for (const nutrient of args.filter.nutrientFilters) {
//           const filter =
//           if (nutrient.target?.gte || nutrient.target?.lte) {
//           } else if (nutrient.target?.eq) {
//             nutritionFilter.push({});
//           }

//           const nutrientFilter: Prisma.RecipeWhereInput = {
//             nutritionLabel: { every },
//           };
//         }

//         await db.nutritionLabelNutrient.findMany({
//           where: {
//             OR: [
//               {
//                 AND: [
//                   {
//                     nutrientId: "dfg",
//                   },
//                   {
//                     value: {
//                       lte: 7,
//                     },
//                   },
//                 ],
//               },
//             ],
//           },
//         });
//       }

//       return await db.recipe.findMany(search);
//     },
//   }),
// }));

// ============================================ Mutations ===============================

// builder.mutationFields((t) => ({
//   createRecipe: t.prismaField({
//     type: "Recipe",
//     args: {
//       recipe: t.arg({ type: recipeInput, required: true }),
//     },
//     resolve: async (query, root, args) => {
//       return createRecipe(args.recipe, query);
//     },
//   }),
// }));
