// Class to extend the functionality of recipe CRUD operations
import { Prisma, PrismaClient, Recipe, Course } from "@prisma/client";
import { Mappings } from "../importHelpers/ImportTypes.js";
import { RecipeKeeperRecipe } from "../importHelpers/RecipeKeeperParser.js";
import { cast, toNumber } from "../util/Cast.js";
import { db } from "../db.js";
import { readJSON } from "../importHelpers/Readers.js";
import { toTitleCase } from "../util/utils.js";
import { RecipeModel } from "./Recipe.js";

export class RecipeKeeperModel extends RecipeModel {
  constructor(protected readonly db: PrismaClient) {
    super(db);
  }

  async createRecipeKeeperRecipe(
    recipe: RecipeKeeperRecipe,
    imageMapping: { [key: string]: string }
  ): Promise<Recipe> {
    const dbStmt: Prisma.RecipeCreateInput = {
      recipeKeeperId: cast(recipe.recipeId) as string,
      title: cast(recipe.name) as string,
      source: cast(recipe.recipeSource) as string,
      preparationTime: this.getTime(recipe.prepTime),
      cookingTime: this.getTime(recipe.cookTime),
      directions: cast(recipe.recipeDirections) as string,
      notes: cast(recipe.recipeNotes) as string,
      stars: cast(recipe.recipeRating) as number,
      isFavorite: cast(recipe.recipeIsFavourite) as boolean,
      nutritionLabel: this.buildNutritionStmt(recipe),
      photos: this.buildPhotosStmt(recipe, imageMapping),
      isVerified: false,
      course: this.createCourseStmt(
        recipe.recipeCourse
      ) as Prisma.CourseCreateNestedManyWithoutRecipesInput,
      category: this.createCourseStmt(
        recipe.recipeCategory
      ) as Prisma.CategoryCreateNestedManyWithoutRecipesInput,
      ingredients: await this.createRecipeIngredientsStmt(
        recipe.recipeIngredients
      ),
    };

    return await this.db.recipe.create({ data: dbStmt });
  }

  private createCourseStmt(courses: string[]): unknown {
    const newCourses = courses
      .filter((course) => cast(course) as string)
      .map((course) => {
        const name = toTitleCase(cast(course) as string);
        const stmt = {
          where: { name },
          create: { name },
        };
        return stmt;
      });

    if (newCourses.length < 1) return undefined;
    return { connectOrCreate: newCourses };
  }

  private buildPhotosStmt(
    recipe: RecipeKeeperRecipe,
    imageMapping: { [key: string]: string }
  ): Prisma.RecipePhotosCreateNestedManyWithoutRecipeInput | undefined {
    if (recipe.photos.length > 0) {
      return {
        create: recipe.photos.map((photo) => ({
          isPrimary: this.checkIfPrimaryPhoto(photo),
          photo: {
            connect: {
              hash: imageMapping[photo],
            },
          },
        })),
      };
    }
    return undefined;
  }

  //Check the filename to see if the path is primary photo in Recipe Keeper
  private checkIfPrimaryPhoto(filePath: string): boolean {
    const removedExtension = filePath.replace(/\.[^/.]+$/, "");
    return removedExtension.endsWith("_0");
  }

  private filterNutrients(recipe: RecipeKeeperRecipe, mapping: Mappings) {
    const nutrients = Object.keys(mapping.recipeKeeper);
    const filteredList = nutrients.filter((nutrient) => {
      const key = nutrient as keyof RecipeKeeperRecipe;
      return nutrient in recipe && (cast(recipe[key]) as number);
    });
    return filteredList;
  }

  private buildNutritionStmt(
    recipe: RecipeKeeperRecipe
  ): Prisma.NutritionLabelCreateNestedManyWithoutRecipeInput {
    const nutrientMappings = readJSON("../mappings.json") as Mappings;
    return {
      create: {
        name: cast(recipe.name) as string,
        source: "RECIPE_KEEPER",
        percentage: 100,
        servings: this.extractServingSize(recipe.recipeYield),
        nutrients: {
          create: this.filterNutrients(recipe, nutrientMappings).map(
            (nutrient) => {
              const key = nutrient as keyof RecipeKeeperRecipe;
              const name = nutrientMappings.recipeKeeper[nutrient];
              return {
                nutrient: {
                  connect: {
                    name: name,
                  },
                },
                value: cast(recipe[key] as string) as number,
              };
            }
          ),
        },
      },
    };
  }

  private getTime(input: string): number {
    const match = Array.from(input.matchAll(/(?<time>\d+)(?<unit>.)/gm))[0];
    if (match.groups) {
      const time: number = parseInt(match.groups.time);
      const unit: string = match.groups.unit;
      if (unit === "S") {
        return time / 60;
      } else if (unit === "H") {
        return time * 60;
      } else {
        return time;
      }
    }
    return 0;
  }

  private extractServingSize(input: string): number {
    if (input !== undefined && input !== null) {
      const numbers = input.match(/\d+\.\d+|\d+\b|\d+(?=\w)/g);
      if (numbers !== null && numbers.length > 0) {
        const result = toNumber(numbers[0]);
        return result === undefined ? 1 : result;
      }
    }
    return 1;
  }
}