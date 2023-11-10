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

  async parseIngredients(
    expirationRules: ExpirationRule[],
    ingredientCategories: IngredientCategory[]
  ): Promise<Prisma.IngredientCreateInput[]> {
    const data = await readCSV(this.ingredientPaths);
    const createStmts: Prisma.IngredientCreateManyInput[] = [];

    for (const { record } of data) {
      const createStmt: Prisma.IngredientCreateInput = {
        name: cast(record.name) as string,
        variant: cast(record.variant) as string,
        storageInstructions: cast(record.storageInstruction) as string,
      };
      if (record.alternateNames) {
        createStmt.alternateNames = record.alternateNames.split(", ");
      }

      //   Add matching expiration rule
      const ruleMatches = expirationRules.filter((rule) => {
        `${rule.name} ${rule.variant}` === record.expirationRule;
      });
      if (ruleMatches.length > 0) {
        createStmt.expirationRule = { connect: { id: ruleMatches[0].id } };
      }

      //   Add matching Category
      const categoryMatches = ingredientCategories.filter(
        (category) => category.name === toTitleCase(record.category)
      );
      if (categoryMatches.length > 0) {
        createStmt.category = { connect: { id: categoryMatches[0].id } };
      }
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
      if (!uniqueNames.has(category)) {
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
