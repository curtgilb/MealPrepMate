import { Mappings, DriLookup } from "./ImportTypes.js";
import {
  Gender,
  NutrientType,
  Prisma,
  SpecialCondition,
  DayOfWeek,
  PrismaClient,
} from "@prisma/client";
import { toNumber, toBoolean } from "../util/Cast.js";
import {
  checkIfPrimaryPhoto,
  extractServingSize,
  createRecipeIngredients,
} from "../services/RecipeService.js";
import { cast } from "../util/Cast.js";

// The purpose of this class is to take data read in from reading csv, html, etc, files and transform them so that they are ready to be inserted into the database.
export class Transformer {
  toNutrientTypeEnum(value: string): NutrientType {
    let nutrientType = cast(value) as string;
    if (nutrientType) {
      nutrientType = nutrientType.toUpperCase();
      if (["MINERAL", "MINERALS"].includes(nutrientType)) return "MINERAL";
      else if (["VITAMIN", "VITAMINS"].includes(nutrientType)) return "VITAMIN";
      else if (["FAT", "FATS", "LIPID"].includes(nutrientType)) return "FAT";
      else if (["PROTEIN", "PROTEINS"].includes(nutrientType)) return "PROTEIN";
      else if (
        ["CARBS", "CARBOHYDRATES", "CARBOHYDRATE"].includes(nutrientType)
      )
        return "CARBOHYDRATE";
      else if (nutrientType === "ALCOHOL") return "ALCHOHOL";
    }
    return "OTHER";
  }

  toGenderEnum(value: string): Gender {
    let gender = cast(value) as string;
    if (gender) {
      gender = gender.toUpperCase();
      if (["M", "MALE"].includes(gender)) return "MALE";
      else if (["F", "FEMALE"].includes(gender)) return "FEMALE";
    }
    throw new Error(`Unable to convert ${value} to a gender`);
  }

  toSpecialConditionEnum(value: string): SpecialCondition {
    let specialCondition = cast(value) as string;
    if (specialCondition) {
      specialCondition = specialCondition.toUpperCase();
      if (["PREGNANT"].includes(specialCondition)) return "PREGNANT";
      else if (["LACTATING"].includes(specialCondition)) return "LACTATING";
    }
    return "NONE";
  }

  toDayOfWeekEnum(value: string): DayOfWeek {
    let dayOfWeek = cast(value) as string;
    if (dayOfWeek) {
      dayOfWeek = dayOfWeek.toUpperCase();
      if (["MONDAY", "MON"].includes(dayOfWeek)) return "MONDAY";
      else if (["TUESDAY", "TUES"].includes(dayOfWeek)) return "TUESDAY";
      else if (["WEDNESDAY", "WED"].includes(dayOfWeek)) return "WEDNESDAY";
      else if (["THURSDAY", "THURS"].includes(dayOfWeek)) return "THURSDAY";
      else if (["FRIDAY", "FRI"].includes(dayOfWeek)) return "FRIDAY";
      else if (["SATURDAY", "SAT"].includes(dayOfWeek)) return "SATURDAY";
      else if (["SUNDAY", "SUN"].includes(dayOfWeek)) return "SUNDAY";
    }
    throw new Error(`Unable to convert ${value} to a day of week`);
  }

  createMappings(nutrients: { [key: string]: string }[]): Mappings {
    // Create mappings from import names to nutrient names
    const mappings: Mappings = {
      myFitnessPal: {},
      recipeKeeper: {},
      cronometer: {},
      dri: {},
    };
    nutrients.reduce(
      (
        accumulation: Mappings,
        current: { [key: string]: string }
      ): Mappings => {
        if (current.recipeKeeper !== undefined) {
          accumulation.recipeKeeper[current.recipeKeeper] = current.nutrient;
        }
        if (current.cronometer !== undefined) {
          accumulation.cronometer[current.cronometer] = current.nutrient;
        }
        if (current.dri !== undefined) {
          accumulation.dri[current.dri] = current.nutrient;
        }
        if (current.myFitnessPal !== undefined) {
          accumulation.myFitnessPal[current.myFitnessPal] = current.nutrient;
        }
        return accumulation;
      },
      mappings
    );

    return mappings;
  }

  // In order to create with alternate names, records must be create one at a time (i.e., no createMany)
  toIngredient(record: {
    [key: string]: string;
  }): Prisma.IngredientCreateInput {
    const ingredient: Prisma.IngredientCreateInput = {
      name: cast(record.name) as string,
      storageInstructions: cast(record.storageInstructions) as string,
    };
    if (cast(record.alternateNames) as string) {
      ingredient.alternateNames = {
        createMany: {
          data: (cast(record.alternateNames) as string)
            .split(",")
            .map((name) => ({ name })),
        },
      };
    }
    return ingredient;
  }

  createDriLookup(
    dailyRecommendedIntake: { [key: string]: string }[]
  ): DriLookup {
    const driLookup: DriLookup = {};
    // each row in nutrients.csv
    dailyRecommendedIntake.forEach((dri) => {
      // properties that are not nutrients
      const { gender, minAge, maxAge, specialCondition, ...rest } = dri;
      for (const [nutrient, recomendation] of Object.entries(rest)) {
        if (!(nutrient in driLookup)) {
          driLookup[nutrient] = [];
        }
        driLookup[nutrient].push({
          gender: this.toGenderEnum(gender),
          ageMin: cast(minAge) as number,
          ageMax: cast(maxAge) as number,
          specialCondition: this.toSpecialConditionEnum(specialCondition),
          value: cast(recomendation) as number,
        });
      }
    });
    return driLookup;
  }

  toNutrientAndDRI(
    nutrients: { [key: string]: string }[],
    dailyRecommendedIntake: { [key: string]: string }[]
  ): Prisma.NutrientCreateInput[] {
    const driLookup = this.createDriLookup(dailyRecommendedIntake);

    return nutrients.map((record) => {
      const nutrientRecord: Prisma.NutrientCreateInput = {
        name: cast(record.nutrient) as string,
        unit: cast(record.unit) as string,
        unitAbbreviation: cast(record.unitAbbreviation) as string,
        type: this.toNutrientTypeEnum(record.type),
        customTarget: false,
      };

      const alternateNames = cast(record.alternateNames) as string;
      if (alternateNames) {
        nutrientRecord.alternateNames = alternateNames.split(",");
      }

      const driLookupValue = cast(record.driMapping) as string;
      if (driLookupValue) {
        nutrientRecord["dri"] = {
          createMany: {
            data: driLookup[driLookupValue],
          },
        };
      }
      return nutrientRecord;
    });
  }

  toNutritionLabel(
    csvData: {
      [key: string]: string;
    },
    nutrientNameMap: Mappings,
    nutrientIdMap: { [key: string]: string }
  ): Prisma.NutritionLabelCreateInput {
    const { day, time, group, foodName, amount, category, ...rest } = csvData;
    return {
      name: cast(foodName) as string,
      servings: extractServingSize(amount),
      source: "CRONOMETER",
      nutrients: {
        create: Object.entries(rest).map(([nutrient, recomendation]) => {
          return {
            value: cast(recomendation) as number,
            nutrient: {
              connect: {
                id: nutrientIdMap[nutrientNameMap.cronometer[nutrient]],
              },
            },
          };
        }),
      },
    };
  }

  //   async toRecipeFromRecipeKeeperHTML(
  //     db: PrismaClient,
  //     recipes: RecipeKeeperRecipe[]
  //   ): Promise<Prisma.RecipeCreateInput[]> {
  //     const convertedRecipes: Prisma.RecipeCreateInput[] = [];
  //     for (const recipe of recipes) {
  //       const ingredients = await createRecipeIngredients(
  //         db,
  //         recipe.recipeIngredients
  //       );
  //       convertedRecipes.push({
  //         recipeKeeperId: cast(recipe.recipeId) as string,
  //         title: cast(recipe.name) as string,
  //         source: cast(recipe.recipeSource) as string,
  //         servingsText: cast(recipe.recipeYield) as string,
  //         servings: extractServingSize(recipe.recipeYield),
  //         preparationTime: cast(recipe.prepTime) as number,
  //         cookingTime: cast(recipe.cookTime) as number,
  //         directions: cast(recipe.recipeDirections) as string,
  //         ingredientsTxt: cast(recipe.recipeIngredients) as string,
  //         notes: cast(recipe.recipeNotes) as string,
  //         stars: cast(recipe.recipeRating) as number,
  //         photos: {
  //           create: recipe.photos.map((photo) => ({
  //             path: photo,
  //             isPrimary: checkIfPrimaryPhoto(photo),
  //           })),
  //         },
  //         isFavorite: cast(recipe.recipeIsFavourite) as boolean,
  //         ingredients: {
  //           create: ingredients,
  //         },
  //       });
  //     }
  //     return convertedRecipes;
  //   }
  // }
}