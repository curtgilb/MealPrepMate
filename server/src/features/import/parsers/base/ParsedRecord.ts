import { ImportType } from "@prisma/client";
import { z, ZodTypeAny } from "zod";
import { db } from "../../../../infrastructure/repository/db.js";
import { hash } from "../../../../util/utils.js";

abstract class ParsedRecord<O> {
  protected input: string;
  protected inputHash: string;
  protected externalId: string | undefined;

  constructor(input: string) {
    this.input = input;
    this.inputHash = hash(input);
  }
  getRecordHash(): string {
    return this.inputHash;
  }

  getExternalId(): string | undefined {
    return this.externalId;
  }

  getOriginalInput(): string {
    return this.input;
  }

  abstract transform<V extends ZodTypeAny>(
    schema: V,
    imageMapping?: Map<string, string>,
    matchingId?: string // Id to matching label/recipe. i.e, if recipe, matching nutrition label
  ): Promise<O>;
}

abstract class NutritionLabelParsedRecord<O> extends ParsedRecord<O> {
  protected importSource: ImportType;
  protected static nutrientMapping = new Map<string, string>();

  constructor(input: string, importSource: ImportType) {
    super(input);
    this.importSource = importSource;
  }

  protected static async initializeMapping(importType: ImportType) {
    const nutrients = await db.nutrientImportMapping.findMany({
      where: { importType: importType },
      select: { lookupName: true, nutrientId: true },
    });

    nutrients.reduce((agg, val) => {
      agg.set(val.lookupName, val.nutrientId);
      return agg;
    }, NutritionLabelParsedRecord.nutrientMapping);
  }

  protected static async matchNutrient(
    externalId: string,
    importType: ImportType
  ) {
    if (NutritionLabelParsedRecord.nutrientMapping.size === 0) {
      await NutritionLabelParsedRecord.initializeMapping(importType);
    }
    return NutritionLabelParsedRecord.nutrientMapping.get(externalId);
  }

  protected extractFirstNumber(input: string) {
    const numbers = input.match(/\d+\.\d+|\d+\b|\d+(?=\w)/g);
    if (numbers !== null && numbers.length > 0 && numbers[0] !== undefined) {
      return z.coerce.number().parse(numbers[0]);
    }
    return 0;
  }

  protected extractServingSize(servingString: string) {
    let serving = 1;
    if (servingString) {
      serving = this.extractFirstNumber(servingString);
    }
    return serving;
  }
}

abstract class RecipeParsedRecord<O> extends NutritionLabelParsedRecord<O> {
  constructor(input: string, importSource: ImportType) {
    super(input, importSource);
  }

  async matchCollections({
    cuisines,
    categories,
    courses,
  }: {
    cuisines?: string[];
    categories?: string[];
    courses?: string[];
  }) {
    const courseIds =
      courses &&
      (await Promise.all(
        courses
          .map(async (course) => (await db.course.findOrCreate(course)).id)
          .filter((id) => id)
      ));
    const categoryIds =
      categories &&
      (await Promise.all(
        categories
          .map(
            async (category) => (await db.category.findOrCreate(category)).id
          )
          .filter((id) => id)
      ));

    const cuisineIds =
      cuisines &&
      (await Promise.all(
        cuisines.map(
          async (cuisine) => (await db.cuisine.findOrCreate(cuisine)).id
        )
      ));
    return {
      courseIds,
      categoryIds,
      cuisineIds,
    };
  }
}

export { NutritionLabelParsedRecord, RecipeParsedRecord, ParsedRecord };
