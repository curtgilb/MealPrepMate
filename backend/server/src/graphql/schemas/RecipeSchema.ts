import { builder } from "../builder.js";
import { Prisma } from "@prisma/client";
import { db } from "../../db.js";
import { createRecipe } from "../../extensions/RecipeExtension.js";

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

builder.prismaObject("Cuisine", {
  name: "Cuisine",
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    recipes: t.relation("recipes"),
  }),
});

builder.prismaObject("Category", {
  name: "Category",
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    recipes: t.relation("recipes"),
  }),
});

builder.prismaObject("Course", {
  name: "Course",
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    recipes: t.relation("recipes"),
  }),
});

builder.prismaObject("Photo", {
  name: "Photo",
  fields: (t) => ({
    id: t.exposeID("id"),
    url: t.exposeString("path"),
    isPrimary: t.exposeBoolean("isPrimary"),
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
    unit: t.exposeString("unit", { nullable: true }),
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

// ============================================ Queries =================================
builder.queryFields((t) => ({
  cuisines: t.prismaField({
    type: ["Cuisine"],
    args: {
      searchString: t.arg.string(),
    },
    resolve: async (query, root, args) => {
      const search: Prisma.CuisineFindManyArgs = { ...query };
      if (args.searchString) {
        search.where = {
          name: {
            contains: args.searchString,
            mode: "insensitive",
          },
        };
      }
      return await db.cuisine.findMany(search);
    },
  }),
  categories: t.prismaField({
    type: ["Category"],
    args: {
      searchString: t.arg.string(),
    },
    resolve: async (query, root, args) => {
      const search: Prisma.CategoryFindManyArgs = { ...query };
      if (args.searchString) {
        search.where = {
          name: {
            contains: args.searchString,
            mode: "insensitive",
          },
        };
      }
      return await db.category.findMany(search);
    },
  }),
  courses: t.prismaField({
    type: ["Course"],
    args: {
      searchString: t.arg.string(),
    },
    resolve: async (query, root, args) => {
      const search: Prisma.CourseFindManyArgs = { ...query };
      if (args.searchString) {
        search.where = {
          name: {
            contains: args.searchString,
            mode: "insensitive",
          },
        };
      }
      return await db.course.findMany(search);
    },
  }),
}));

// ============================================ Mutations ===============================

builder.mutationFields((t) => ({
  createRecipe: t.prismaField({
    type: "Recipe",
    args: {
      recipe: t.arg({ type: recipeInput, required: true }),
    },
    resolve: async (query, root, args) => {
      return createRecipe(args.recipe, query);
    },
  }),
  createCuisine: t.prismaField({
    type: ["Cuisine"],
    args: {
      name: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args) => {
      await db.cuisine.create({ data: { name: args.name } });
      return db.cuisine.findMany({ ...query });
    },
  }),
  deleteCuisine: t.prismaField({
    type: ["Cuisine"],
    args: {
      cuisineId: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args) => {
      await db.cuisine.delete({ where: { id: args.cuisineId } });
      return await db.cuisine.findMany({ ...query });
    },
  }),
  createCategory: t.prismaField({
    type: ["Category"],
    args: {
      name: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args) => {
      await db.category.create({ data: { name: args.name } });
      return await db.category.findMany({ ...query });
    },
  }),
  deleteCategory: t.prismaField({
    type: ["Category"],
    args: {
      categoryId: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args) => {
      await db.category.delete({ where: { id: args.categoryId } });
      return await db.category.findMany({ ...query });
    },
  }),
  createCourse: t.prismaField({
    type: ["Course"],
    args: {
      name: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args) => {
      await db.category.create({ data: { name: args.name } });
      return await db.category.findMany({ ...query });
    },
  }),
  deleteCourse: t.prismaField({
    type: ["Course"],
    args: {
      courseId: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args) => {
      await db.course.delete({ where: { id: args.courseId } });
      return await db.course.findMany({ ...query });
    },
  }),
  changeRecipeCuisine: t.prismaField({
    type: "Cuisine",
    args: {
      recipeId: t.arg.string({ required: true }),
      cuisineId: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args) => {
      return await db.recipe.update({
        where: { id: args.recipeId },
        data: {},
      });
    },
  }),
}));
