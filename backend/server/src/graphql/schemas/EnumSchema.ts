import {
  Gender,
  SpecialCondition,
  ImportStatus,
  RecordStatus,
  DayOfWeek,
  ImportType,
  NutrientType,
} from "@prisma/client";
import { builder } from "../builder.js";

builder.enumType(Gender, { name: "Gender" });
builder.enumType(SpecialCondition, { name: "SpecialCondition" });
builder.enumType(ImportStatus, { name: "ImportStatus" });
builder.enumType(RecordStatus, { name: "RecordStatus" });
builder.enumType(DayOfWeek, { name: "DayOfWeek" });
builder.enumType(ImportType, { name: "ImportType" });
builder.enumType(NutrientType, { name: "NutrientType" });
