/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { builder } from "../builder.js";
import { db } from "../db.js";

// ==========================================Custom Scalars===================================
builder.scalarType("File", {
  serialize: () => {
    throw new Error("Uploads can only be used as input types");
  },
});

builder.scalarType("Date", {
  serialize: () => {
    throw new Error("Uploads can only be used as input types");
  },
});
// ==========================================Imports===========================================
builder.prismaObject("Import", {
  fields: (t) => ({
    id: t.exposeID("id"),
    fileName: t.exposeString("fileName"),
    type: t.exposeString("type"),
    status: t.exposeString("status"),
    url: t.exposeString("path"),
    records: t.relation("importRecords"),
    recordsCount: t.relationCount("importRecords"),
  }),
});

builder.prismaObject("ImportRecord", {
  fields: (t) => ({
    name: t.exposeString("name"),
    status: t.exposeString("status"),
    recipe: t.relation("recipe"),
    nutritionLabel: t.relation("nutritionLabel"),
  }),
});

// ==========================================Recipes==========================================
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

builder.prismaObject("RecipePhotos", {
  name: "RecipePhotos",
  fields: (t) => ({
    isPrimary: t.exposeBoolean("isPrimary"),
    photos: t.relation("photo"),
  }),
});

builder.prismaObject("Photo", {
  name: "Photo",
  fields: (t) => ({
    id: t.exposeID("id"),
    url: t.exposeString("path"),
  }),
});

builder.prismaObject("RecipeIngredient", {
  name: "RecipeIngredients",
  fields: (t) => ({
    isIngredient: t.exposeBoolean("isIngredient"),
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

// ==========================================Ingredients==========================================
builder.prismaObject("Ingredient", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    alternateNames: t.relation("alternateNames"),
    storageInstructions: t.exposeString("storageInstructions", {
      nullable: true,
    }),
    priceHistory: t.relation("priceHistory"),
    expiration: t.relation("expirationRule"),
  }),
});

builder.prismaObject("IngredientAlternateName", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
  }),
});

builder.prismaObject("IngredientPrice", {
  fields: (t) => ({
    retailer: t.exposeString("retailer"),
    price: t.exposeFloat("price"),
    quantity: t.exposeFloat("quantity"),
    unit: t.exposeString("unit"),
    pricePerUnit: t.exposeFloat("pricePerUnit"),
  }),
});

builder.prismaObject("ExpirationRule", {
  fields: (t) => ({
    id: t.exposeID("id"),
    defrostTime: t.exposeInt("defrostTime", { nullable: true }),
    perishable: t.exposeBoolean("perishable", { nullable: true }),
    tableLife: t.exposeInt("tableLife", { nullable: true }),
    fridgeLife: t.exposeInt("fridgeLife", { nullable: true }),
    freezerLife: t.exposeInt("freezerLife", { nullable: true }),
  }),
});

// ==========================================Nutrition==========================================

builder.prismaObject("NutritionLabel", {
  name: "NutritionLabel",
  fields: (t) => ({
    id: t.exposeID("id"),
    recipe: t.relation("recipe", { nullable: true }),
    name: t.exposeString("name"),
    percentage: t.exposeInt("percentage", { nullable: true }),
    servings: t.exposeInt("servings", { nullable: true }),
    ingredientGroup: t.relation("ingredientGroup"),
    nutrients: t.relation("nutrients"),
  }),
});

builder.prismaObject("NutritionLabelNutrient", {
  name: "NutritionLabelNutrient",
  fields: (t) => ({
    value: t.exposeFloat("value"),
    label: t.relation("nutrient"),
  }),
});

builder.prismaObject("Nutrient", {
  fields: (t) => ({
    name: t.exposeString("name"),
    unit: t.exposeString("unit"),
    unitAbbreviation: t.exposeString("unitAbbreviation"),
    alternateNames: t.exposeStringList("alternateNames"),
    type: t.exposeString("type"),
    dailyReferenceIntakeValue: t.field({
      type: "Float",
      resolve: async (parent) => {
        return 0;
      },
    }),
  }),
});

builder.prismaObject("DailyReferenceIntake", {
  fields: (t) => ({
    value: t.exposeFloat("value"),
  }),
});
