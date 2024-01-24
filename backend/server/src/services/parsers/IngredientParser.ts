import { ExpirationRule, IngredientCategory, Prisma } from "@prisma/client";
import { readCSV } from "../io/Readers.js";
import { cast } from "../../util/Cast.js";
import { toTitleCase } from "../../util/utils.js";

type IngredientParserInput = {
  ingredientCsvPath: string;
  expirationRulePath: string;
};

export class IngredientParser {
  ingredientPaths: string;
  expirationRulesPath: string;

  constructor(input?: IngredientParserInput) {
    this.ingredientPaths = input?.ingredientCsvPath
      ? input.ingredientCsvPath
      : "../../../data/seed_data/Ingredients.csv";
    this.expirationRulesPath = input?.expirationRulePath
      ? input.expirationRulePath
      : "../../../data/seed_data/ExpirationRules.csv";
  }

  async parseIngredients(): Promise<Prisma.IngredientCreateInput[]> {
    const data = await readCSV(this.ingredientPaths);
    const createStmts: Prisma.IngredientCreateInput[] = [];

    for (const { record } of data) {
      const createStmt: Prisma.IngredientCreateInput = {
        name: cast(record.name) as string,
        variant: cast(record.variant) as string,
        storageInstructions: cast(record.storageInstruction) as string,
      };

      if (record.alternateNames) {
        createStmt.alternateNames = record.alternateNames.split(", ");
      }

      const category = toTitleCase(record.category);
      if (category) {
        createStmt.category = {
          connectOrCreate: {
            create: {
              name: category,
            },
            where: {
              name: category,
            },
          },
        };
      }
      createStmts.push(createStmt);
    }
    return createStmts;
  }

  async parseIngredientCategories(): Promise<
    Prisma.IngredientCategoryCreateManyInput[]
  > {
    const data = await readCSV(this.ingredientPaths);
    const uniqueNames = new Set();
    const stmt: Prisma.IngredientCategoryCreateManyInput[] = [];
    data.forEach(({ record }) => {
      const category = toTitleCase(record.category);
      if (!uniqueNames.has(category) && category) {
        uniqueNames.add(category);
        stmt.push({ name: category });
      }
    });
    return stmt;
  }

  async parseExpirationRules(): Promise<
    Prisma.ExpirationRuleCreateManyInput[]
  > {
    const data = await readCSV(this.expirationRulesPath);
    const createStmts: Prisma.ExpirationRuleCreateManyInput[] = [];
    for (const { record } of data) {
      createStmts.push({
        name: cast(record.name) as string,
        variant: cast(record.variant) as string,
        defrostTime: cast(record.defrostTime) as number,
        perishable: cast(record.perishable) as boolean,
        tableLife: cast(record.tableLife) as number,
        fridgeLife: cast(record.fridgeLife) as number,
        freezerLife: cast(record.freezerLife) as number,
      });
    }
    return createStmts;
  }
}
