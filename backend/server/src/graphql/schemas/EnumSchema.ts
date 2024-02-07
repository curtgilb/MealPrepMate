import {
  Gender,
  SpecialCondition,
  ImportStatus,
  RecordStatus,
  Meal,
  ImportType,
  NutrientType,
} from "@prisma/client";
import { builder } from "../builder.js";

builder.enumType(Gender, { name: "Gender" });
builder.enumType(SpecialCondition, { name: "SpecialCondition" });
builder.enumType(ImportStatus, { name: "ImportStatus" });
builder.enumType(RecordStatus, { name: "RecordStatus" });
const meal = builder.enumType(Meal, { name: "Meal" });
builder.enumType(ImportType, { name: "ImportType" });
builder.enumType(NutrientType, { name: "NutrientType" });

export { meal };
