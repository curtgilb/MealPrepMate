import { builder } from "./builder.js";
import "./schemas/EnumSchema.js";
import "./schemas/ImportSchema.js";
import "./schemas/IngredientSchema.js";
import "./schemas/MealplanSchema.js";
import "./schemas/NutritionSchema.js";
import "./schemas/RecipeMetaSchema.js";
import "./schemas/RecipeSchema.js";
import "./schemas/UtilitySchema.js";
import "./schemas/UserSchema.js";

export const schema = builder.toSchema();
