import {
  FoodType,
  Gender,
  ImportStatus,
  ImportType,
  Meal,
  NutrientType,
  RecordStatus,
} from "@prisma/client";
import { builder } from "../builder.js";

enum ExternalImportType {
  RECIPE_KEEPER,
  CRONOMETER,
}

builder.enumType(Gender, { name: "Gender" });
const importStatus = builder.enumType(ImportStatus, { name: "ImportStatus" });
const foodTypeEnum = builder.enumType(FoodType, { name: "FoodType" });
const recordStatus = builder.enumType(RecordStatus, { name: "RecordStatus" });
const meal = builder.enumType(Meal, { name: "Meal" });
const externalImportType = builder.enumType(ExternalImportType, {
  name: "ImportType",
});
const PrismaImportType = builder.enumType(ImportType, {
  name: "PrismaImportType",
});
builder.enumType(NutrientType, { name: "NutrientType" });

export {
  externalImportType,
  ExternalImportType,
  importStatus,
  meal,
  PrismaImportType,
  recordStatus,
  foodTypeEnum,
};
