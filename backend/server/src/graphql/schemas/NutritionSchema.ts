import { builder } from "../builder.js";
// ============================================ Types ===================================
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
// ============================================ Inputs ==================================

// ============================================ Queries =================================

// ============================================ Mutations ===============================
