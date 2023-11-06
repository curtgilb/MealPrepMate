import { MeasurementUnit, Prisma } from "@prisma/client";
import { Mappings } from "../../types/CustomTypes.js";
import { readCSV } from "../io/Readers.js";
import { db } from "../../db.js";
import {
  toGenderEnum,
  toNutrientTypeEnum,
  toSpecialConditionEnum,
} from "../../util/Cast.js";
import { cast } from "../../util/Cast.js";
import { writeJson } from "../io/Readers.js";
import { al } from "vitest/dist/reporters-5f784f42.js";

type NutrientParseInput = {
  nutrientPath: string;
  mineralDriPath: string;
  vitaminDriPath: string;
  mappingSavePath: string;
};

type NutrientParseOutput = {
  createNutrientsStmt: Prisma.NutrientCreateManyInput[];
  updateNutrientsStmt: Prisma.NutrientUpdateArgs[];
  dri: Prisma.DailyReferenceIntakeCreateInput[];
  mappings: Mappings;
};

export class NutrientParser {
  // Dictionary of import types (recipekeeper, my fitness pal,etc.).
  // Each of those are a dictionary mapping name in csv to DB name
  mappings: Mappings = {
    cronometer: {},
    recipeKeeper: {},
    myFitnessPal: {},
    dri: {},
  };
  nutrientPath: string;
  mineralDriPath: string;
  vitaminDriPath: string;
  mappingSavePath: string;

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
    this.mappingSavePath = input?.mappingSavePath
      ? input.mappingSavePath
      : "../../../mappings.json";
  }

  async parse(): Promise<NutrientParseOutput> {
    const nutrients = await this.parseNutrients();
    const dris = await this.parseDRIs();
    writeJson(this.mappingSavePath, this.mappings);
    return {
      createNutrientsStmt: nutrients.createNutrientsStmt,
      updateNutrientsStmt: nutrients.updateNutrientsStmt,
      dri: dris,
      mappings: this.mappings,
    };
  }

  private findUnitMatch(
    units: MeasurementUnit[],
    searchString: string
  ): string {
    const result = units.filter(
      (unit) =>
        searchString === unit.name || unit.abbreviations.includes(searchString)
    );
    if (result.length !== 1)
      throw Error("More than one match returned for nutrient unit");
    return result[0].id;
  }

  private async parseNutrients(): Promise<{
    createNutrientsStmt: Prisma.NutrientCreateManyInput[];
    updateNutrientsStmt: Prisma.NutrientUpdateArgs[];
  }> {
    const data = await readCSV(this.nutrientPath);

    // read in nutrients to create mapping
    // Use mapping to map DRI to nutrient,
    const createNutrientsStmt: Prisma.NutrientCreateManyInput[] = [];
    const updateNutrientsStmt: Prisma.NutrientUpdateArgs[] = [];
    for (const { record } of data) {
      // Create the mapping
      for (const type of Object.keys(this.mappings)) {
        if (record[type]) {
          this.mappings[type][record[type]] = record.nutrient;
        }
      }

      // Grab the available units
      const units = await db.measurementUnit.findMany({});
      if (units.length === 0)
        throw Error("Measurement units need to be loaded before nutrients");

      //   Create stmts for creating nutrients
      const createStmt: Prisma.NutrientCreateManyInput = {
        name: cast(record.nutrient) as string,
        type: toNutrientTypeEnum(record.type),
        advancedView: cast(record.advancedView) as boolean,
        unitId: this.findUnitMatch(units, record.unit),
      };
      const altNames = record.alternateNames.split(", ").filter((name) => name);
      if (altNames.length > 0) {
        createStmt.alternateNames = altNames;
      }
      createNutrientsStmt.push(createStmt);

      // Connect parent and child nutrients
      updateNutrientsStmt.push({
        where: { name: record.nutrient },
        data: {
          parentNutrient: {
            connect: {
              name: record.parentNutrient,
            },
          },
        },
      });
    }
    return {
      createNutrientsStmt,
      updateNutrientsStmt,
    };
  }

  private async parseDRIs(): Promise<Prisma.DailyReferenceIntakeCreateInput[]> {
    const mineralDRI = await readCSV(this.mineralDriPath);
    const vitaminDRI = await readCSV(this.vitaminDriPath);
    const dris = [...mineralDRI, ...vitaminDRI];
    const createDriStmts: Prisma.DailyReferenceIntakeCreateInput[] = [];
    for (const { record } of dris) {
      const { gender, specialCondition, minAge, maxAge, ...rest } = record;

      for (const [nutrient, value] of Object.entries(rest)) {
        createDriStmts.push({
          nutrient: { connect: { name: this.mappings.dri[nutrient] } },
          value: cast(value) as number,
          gender: toGenderEnum(gender),
          ageMin: cast(minAge) as number,
          ageMax: cast(maxAge) as number,
          specialCondition: toSpecialConditionEnum(specialCondition),
        });
      }
    }
    return createDriStmts;
  }
}
