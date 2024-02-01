import { Gender, ImportType, Prisma, SpecialCondition } from "@prisma/client";
import { readCSV } from "../../services/io/Readers.js";
import { db } from "../../db.js";
import { toGenderEnum, toSpecialConditionEnum } from "../../util/Cast.js";
import { cast } from "../../util/Cast.js";
import { nativeEnum, z } from "zod";
import {
  cleanedStringSchema,
  nullableString,
  stringArray,
} from "../../validations/utilValidations.js";
import { toTitleCase } from "../../util/utils.js";
import { UnitSearch } from "../../search/UnitSearch.js";
import { NutrientType } from "@prisma/client";
import { spec } from "node:test/reporters";

type NutrientParseInput = {
  nutrientPath: string;
  mineralDriPath: string;
  vitaminDriPath: string;
  mappingSavePath: string;
};

const nutrientSchema = z.object({
  nutrient: cleanedStringSchema(30, toTitleCase),
  unitAbbreviation: nullableString,
  unit: cleanedStringSchema(10),
  advancedView: z.boolean(),
  order: z.number().int().positive(),
  notes: nullableString,
  alternateNames: stringArray,
  type: z.nativeEnum(NutrientType),
  parentNutrient: nullableString,
  cronometer: nullableString,
  recipeKeeper: nullableString,
  myFitnessPal: nullableString,
  dri: nullableString,
});

const vitaminDriSchema = z.array(
  z.object({
    gender: nativeEnum(Gender),
    specialCondition: nativeEnum(SpecialCondition),
    minAge: z.number().int().positive(),
    maxAge: z.number().int().positive(),
    vitaminA: z.number().int().positive(),
    vitaminC: z.number().int().positive(),
    vitaminD: z.number().int().positive(),
    vitaminE: z.number().int().positive(),
    vitaminK: z.number().int().positive(),
    thiamin: z.number().int().positive(),
    riboflavin: z.number().int().positive(),
    niacin: z.number().int().positive(),
    vitaminB6: z.number().int().positive(),
    folate: z.number().int().positive(),
    vitaminB12: z.number().int().positive(),
    pantothenicAcid: z.number().int().positive(),
    biotin: z.number().int().positive(),
    choline: z.number().int().positive(),
  })
);

const mineralDriSchema = z.array(
  z.object({
    gender: nativeEnum(Gender),
    specialCondition: nativeEnum(SpecialCondition),
    minAge: z.number().int().positive(),
    maxAge: z.number().int().positive(),
    calcium: z.number().int().positive(),
    chromium: z.number().int().positive(),
    copper: z.number().int().positive(),
    fluoride: z.number().int().positive(),
    iodine: z.number().int().positive(),
    iron: z.number().int().positive(),
    magnesium: z.number().int().positive(),
    manganese: z.number().int().positive(),
    molybdenum: z.number().int().positive(),
    phosphorus: z.number().int().positive(),
    selenium: z.number().int().positive(),
    zinc: z.number().int().positive(),
    potassium: z.number().int().positive(),
    sodium: z.number().int().positive(),
    chloride: z.number().int().positive(),
  })
);

export class NutrientLoader {
  nutrientPath: string;
  mineralDriPath: string;
  vitaminDriPath: string;

  constructor(input?: NutrientParseInput) {
    this.nutrientPath = input?.nutrientPath
      ? input.nutrientPath
      : "../../../data/seed_data/nutrients.csv";
    this.vitaminDriPath = input?.nutrientPath
      ? input.nutrientPath
      : "../../../data/seed_data/vitamins_dri.csv";
    this.mineralDriPath = input?.mineralDriPath
      ? input.mineralDriPath
      : "../../../data/seed_data/minerals_dri.csv";
  }

  async parseNutrients(): Promise<{
    createNutrientsStmt: Prisma.NutrientCreateInput[];
    updateNutrientsStmt: Prisma.NutrientUpdateArgs[];
  }> {
    const data = await readCSV(this.nutrientPath);

    // read in nutrients to create mapping
    // Use mapping to map DRI to nutrient,
    const createNutrientsStmt: Prisma.NutrientCreateInput[] = [];
    const updateNutrientsStmt: Prisma.NutrientUpdateArgs[] = [];
    const units = new UnitSearch(await db.measurementUnit.findMany({}));
    for (const { record } of data) {
      // Validate the record
      const cleanedRecord = nutrientSchema.parse(record);
      const matchedUnit = units.search(cleanedRecord.nutrient);

      //   Create stmts for creating nutrients
      const createStmt: Prisma.NutrientCreateInput = {
        name: cleanedRecord.nutrient,
        alternateNames: cleanedRecord.alternateNames,
        type: cleanedRecord.type,
        advancedView: cleanedRecord.advancedView,
        unit: matchedUnit ? { connect: { id: matchedUnit.id } } : {},
        mappings: {
          createMany: {
            data: [
              {
                importType: "CRONOMETER" as ImportType,
                lookupName: cleanedRecord.cronometer,
              },
              {
                importType: "RECIPE_KEEPER" as ImportType,
                lookupName: cleanedRecord.recipeKeeper,
              },
              {
                importType: "MY_FITNESS_PAL" as ImportType,
                lookupName: cleanedRecord.myFitnessPal,
              },
              {
                importType: "DRI" as ImportType,
                lookupName: cleanedRecord.dri,
              },
            ].filter(
              (row) => row.lookupName
            ) as Prisma.NutrientMappingCreateInput[],
          },
        },
      };

      createNutrientsStmt.push(createStmt);

      // Connect parent and child nutrients
      if (cleanedRecord.parentNutrient) {
        updateNutrientsStmt.push({
          where: { name: cleanedRecord.nutrient },
          data: {
            parentNutrient: {
              connect: {
                name: cleanedRecord.parentNutrient,
              },
            },
          },
        });
      }
    }
    return {
      createNutrientsStmt,
      updateNutrientsStmt,
    };
  }

  async getDriMapping(): Promise<Map<string, string>> {
    const nutrients = await db.nutrientMapping.findMany({
      where: { importType: "DRI" },
      include: { nutrient: true },
    });
    if (nutrients.length === 0)
      throw Error("Nutrients and mappings need to be loaded first");

    return nutrients.reduce((agg, val) => {
      agg.set(val.lookupName, val.nutrient.id);
      return agg;
    }, new Map<string, string>());
  }

  async parseDRIs(): Promise<Prisma.DailyReferenceIntakeCreateInput[]> {
    const mineralDRI = await readCSV(this.mineralDriPath);
    const vitaminDRI = await readCSV(this.vitaminDriPath);

    const dris = [...mineralDRI, ...vitaminDRI];
    const mapping = await this.getDriMapping();

    const createDriStmts: Prisma.DailyReferenceIntakeCreateInput[] = [];
    for (const { record } of dris) {
      const { gender, specialCondition, minAge, maxAge, ...rest } = record;

      for (const [nutrient, value] of Object.entries(rest)) {
        if (mapping.has(nutrient)) {
          createDriStmts.push({
            nutrient: { connect: { id: mapping.get(nutrient) } },
            value: z.number().int().positive().parse(value),
            gender: z.nativeEnum(Gender).parse(gender),
            ageMin: z.number().int().positive().parse(minAge),
            ageMax: z.number().int().positive().parse(maxAge),
            specialCondition: z
              .nativeEnum(SpecialCondition)
              .parse(specialCondition),
          });
        }
      }
    }
    return createDriStmts;
  }
}
