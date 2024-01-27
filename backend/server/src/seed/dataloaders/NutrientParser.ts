import { MeasurementUnit, Nutrient, Prisma } from "@prisma/client";
import { readCSV } from "../../services/io/Readers.js";
import { db } from "../../db.js";
import {
  toGenderEnum,
  toNutrientTypeEnum,
  toSpecialConditionEnum,
} from "../../util/Cast.js";
import { cast } from "../../util/Cast.js";

type NutrientParseInput = {
  nutrientPath: string;
  mineralDriPath: string;
  vitaminDriPath: string;
  mappingSavePath: string;
};

export class NutrientParser {
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

  async parseNutrients(): Promise<{
    createNutrientsStmt: Prisma.NutrientCreateManyInput[];
    updateNutrientsStmt: Prisma.NutrientUpdateArgs[];
  }> {
    const data = await readCSV(this.nutrientPath);

    // read in nutrients to create mapping
    // Use mapping to map DRI to nutrient,
    const createNutrientsStmt: Prisma.NutrientCreateManyInput[] = [];
    const updateNutrientsStmt: Prisma.NutrientUpdateArgs[] = [];
    for (const { record } of data) {
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
        recipeKeeperMapping: cast(record.recipeKeeper) as string,
        cronometerMapping: cast(record.cronometer) as string,
        myFitnessPalMapping: cast(record.myFitnessPal) as string,
        driMapping: cast(record.dri) as string,
      };
      const altNames = record.alternateNames.split(", ").filter((name) => name);
      if (altNames.length > 0) {
        createStmt.alternateNames = altNames;
      }
      createNutrientsStmt.push(createStmt);

      // Connect parent and child nutrients
      if (record.parentNutrient) {
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
    }
    return {
      createNutrientsStmt,
      updateNutrientsStmt,
    };
  }

  async parseDRIs(
    nutrients: Nutrient[]
  ): Promise<Prisma.DailyReferenceIntakeCreateInput[]> {
    const mineralDRI = await readCSV(this.mineralDriPath);
    const vitaminDRI = await readCSV(this.vitaminDriPath);
    const dris = [...mineralDRI, ...vitaminDRI];
    const createDriStmts: Prisma.DailyReferenceIntakeCreateInput[] = [];
    const mapping = nutrients.reduce((aggregate, nutrient) => {
      if (nutrient.driMapping) {
        aggregate.set(nutrient.driMapping, nutrient.id);
      }
      return aggregate;
    }, new Map<string, string>());
    for (const { record } of dris) {
      const { gender, specialCondition, minAge, maxAge, ...rest } = record;

      for (const [nutrient, value] of Object.entries(rest)) {
        if (mapping.has(nutrient)) {
          createDriStmts.push({
            nutrient: { connect: { id: mapping.get(nutrient) } },
            value: cast(value) as number,
            gender: toGenderEnum(gender),
            ageMin: cast(minAge) as number,
            ageMax: cast(maxAge) as number,
            specialCondition: toSpecialConditionEnum(specialCondition),
          });
        }
      }
    }
    return createDriStmts;
  }
}
