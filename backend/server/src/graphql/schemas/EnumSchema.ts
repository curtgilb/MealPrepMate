import {
  Gender,
  SpecialCondition,
  ImportStatus,
  RecordStatus,
  Meal,
  NutrientType,
  ImportType,
} from "@prisma/client";
import { builder } from "../builder.js";

enum ExternalImportType {
  RECIPE_KEEPER,
  CRONOMETER,
}

enum RecordAction {
  REIMPORT,
  DUPLICATE,
  IGNORE,
  VERIFY,
}

builder.enumType(Gender, { name: "Gender" });
builder.enumType(SpecialCondition, { name: "SpecialCondition" });
const importStatus = builder.enumType(ImportStatus, { name: "ImportStatus" });
const recordStatus = builder.enumType(RecordStatus, { name: "RecordStatus" });
const meal = builder.enumType(Meal, { name: "Meal" });
const externalImportType = builder.enumType(ExternalImportType, {
  name: "ImportType",
});
const PrismaImportType = builder.enumType(ImportType, {
  name: "PrismaImportType",
});
builder.enumType(NutrientType, { name: "NutrientType" });
builder.enumType(RecordAction, {
  name: "RecordAction",
});

export {
  meal,
  externalImportType,
  ExternalImportType,
  PrismaImportType,
  importStatus,
  recordStatus,
};
