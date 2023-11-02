import { builder } from "./builder.js";
import "./schemas/ImportSchema.js";
import "./schemas/IngredientSchema.js";
import "./schemas/MealplanSchema.js";
import "./schemas/NutritionSchema.js";
import "./schemas/RecipeMetaSchema.js";
import "./schemas/UserSchema.js";

export const schema = builder.toSchema();
