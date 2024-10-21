import {
  FoodType,
  Gender,
  ImportStatus,
  ImportType,
  Meal,
  MeasurementSystem,
  NutrientType,
  RecordStatus,
} from "@prisma/client";
import { builder } from "@/presentation/builder.js";

enum ExternalImportType {
  RECIPE_KEEPER,
  CRONOMETER,
}

builder.enumType(Gender, { name: "Gender" });
const importStatus = builder.enumType(ImportStatus, { name: "ImportStatus" });

const recordStatus = builder.enumType(RecordStatus, { name: "RecordStatus" });
const meal = builder.enumType(Meal, { name: "Meal" });
const measurementSystem = builder.enumType(MeasurementSystem, {
  name: "MeasurementSystem",
});
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
  measurementSystem,
};
