import {
  NutritionLabel,
  Recipe,
  NutrientType,
  MeasurementUnit,
} from "@prisma/client";
import { db } from "../../db.js";
import {
  LabelWithNutrients,
  NutrientWithUnit,
  NutrientValue,
} from "../../types/CustomTypes.js";

type NutrientAggregatorArgs = string[] | Recipe[] | NutritionLabel[];

// NutrientId: -> {value: number; perServing: number}
type NutrientMap = Map<string, NutrientValue>;

type ScalingArgs = {
  factor?: number;
  totalServings?: number;
  servingsUsed?: number;
};

type NutrientMapArgs = {
  id: string;
} & ScalingArgs;

class NutrientAggregator {
  private args: NutrientAggregatorArgs;
  //   Recipe ID/Standalone label id -> nutrient map
  private aggregatedNutrients = new Map<string, LabelAggregator>();

  constructor(args: NutrientAggregatorArgs) {
    this.args = args;
  }

  private async getLabels(): Promise<LabelWithNutrients[]> {
    const ids: string[] = this.args.map((item) =>
      typeof item === "string" ? item : item.id
    );

    return await db.nutritionLabel.findMany({
      where: {
        verifed: true,
        OR: [{ recipeId: { in: ids } }, { id: { in: ids } }],
      },
      include: { nutrients: true, servingSizeUnit: true },
    });
  }

  async aggregateNutrients() {
    const labels = await this.getLabels();
    for (const label of labels) {
      const id = label.recipeId ?? label.id;
      const existing = this.aggregatedNutrients.get(id);
      if (!existing) {
        const agg = new LabelAggregator();
        agg.addLabel(label);
        this.aggregatedNutrients.set(id, agg);
      } else {
        existing.addLabel(label);
      }
    }
  }

  aggregateNutrientsFromGraphql() {}

  getNutrientMap(args: NutrientMapArgs[]): NutrientMap {
    const mappings = args.map((arg) => {
      const label = this.aggregatedNutrients.get(arg.id);
      if (!label) throw new Error("ID does not match any in aggregation");

      return label.getLabelNutrientMap({
        factor: arg.factor,
        totalServings: arg.totalServings,
        servingsUsed: arg.servingsUsed,
      });
    });

    if (mappings.length > 1) {
      const agg = mappings.reduce((acc, cur) => {
        acc.addNutrientMap(cur);
        return acc;
      }, new LabelAggregator());
      return agg.getAggreagteNutrientMap();
    } else {
      return mappings[0];
    }
  }
}

class LabelAggregator {
  primaryLabel: LabelWithNutrients | undefined;
  labels: LabelWithNutrients[] = [];
  mapping: NutrientMap = new Map<string, NutrientValue>();
  aggregateMap: NutrientMap = new Map<string, NutrientValue>();

  addLabel(label: LabelWithNutrients) {
    this.labels.push(label);
    if (label.isPrimary) {
      this.primaryLabel = label;
    }
  }

  private getUsageRatio(label: LabelWithNutrients) {
    let usageRatio = 1;
    if (!label.isPrimary && label.servingsUsed && label.servings) {
      usageRatio = label.servingsUsed / label.servings;
    }
    return usageRatio;
  }

  private sumNutrients(
    mapping: NutrientMap,
    scaleFactor = 1,
    totalServings = 1,
    servingsUsed = 1
  ) {
    for (const label of this.labels) {
      const ratio = this.getUsageRatio(label);
      for (const nutrient of label.nutrients) {
        let adjustedValue = nutrient.value * ratio * scaleFactor;
        adjustedValue = adjustedValue * (servingsUsed / totalServings);
        const existing = mapping.get(nutrient.nutrientId);
        if (!existing) {
          mapping.set(nutrient.nutrientId, {
            value: adjustedValue,
            valuePerServing: 0,
          });
        } else {
          existing.value = existing.value + adjustedValue;
        }
      }
    }
  }

  private scaleNutrients(mapping: NutrientMap, totalServings: number) {
    for (const nutrient of mapping.values()) {
      nutrient.valuePerServing = nutrient.value / totalServings;
    }
  }

  addNutrientMap(mapping: NutrientMap) {
    for (const [id, nutrient] of mapping.entries()) {
      const existing = this.aggregateMap.get(id);
      if (!existing) {
        this.aggregateMap.set(id, {
          value: nutrient.value,
          valuePerServing: nutrient.valuePerServing,
        });
      } else {
        existing.value = existing.value + nutrient.value;
        existing.valuePerServing =
          existing.valuePerServing + nutrient.valuePerServing;
      }
    }
  }

  getAggreagteNutrientMap() {
    return this.aggregateMap;
  }

  getLabelNutrientMap(args: ScalingArgs) {
    const mapping = new Map<string, NutrientValue>();
    let totalServings = [
      args.totalServings,
      this.primaryLabel?.servings,
      1,
    ].find((servings) => servings);
    totalServings = totalServings ?? 1;
    const globalScaleFactor = args.factor ?? 1;
    const servingsUsed = args.servingsUsed ?? totalServings;

    this.sumNutrients(mapping, globalScaleFactor, totalServings, servingsUsed);
    this.scaleNutrients(mapping, totalServings);
    this.mapping = mapping;
    return mapping;
  }
}

type FullNutrient = {
  id: string;
  name: string;
  value: number;
  category: NutrientType;
  unit: MeasurementUnit;
  perServing?: number;
  target?: NutrientTarget;
  children: FullNutrient[];
};

type NutrientTarget = {
  dri?: number;
  customTarget?: number;
};

type PrettyNutritionLabel = {
  calories: number;
  caloriesPerServing?: number;
  carbPercentage: number;
  proteinPercentage: number;
  fatPercentage: number;
};

type ServingInfo = {
  servings?: number;
  servingsUsed?: number;
  servingUnit?: string;
  servingSize?: number;
};

type CreateLabelArgs = {
  nutrients: NutrientMap;
  servings: ServingInfo;
  advanced: boolean;
};

type FullNutritionLabel = PrettyNutritionLabel &
  ServingInfo & { nutrients: FullNutrient[] };

class LabelMaker {
  private parentNutrients: NutrientWithUnit[] = [];
  private childNutrients = new Map<string, NutrientWithUnit[]>();

  private async initializeExistingNutrients() {
    const profile = await db.healthProfile.findFirstOrThrow({});
    const age = new Date().getFullYear() - profile.yearBorn;
    // Get nutrients in order
    this.parentNutrients = await db.nutrient.findMany({
      include: {
        unit: true,
        dri: {
          where: {
            gender: profile.gender,
            ageMin: { lte: age },
            ageMax: { gte: age },
            specialCondition: "NONE",
          },
        },
      },
      orderBy: { order: "asc" },
    });

    this.childNutrients = this.parentNutrients
      .filter((nutrient) => nutrient.parentNutrientId)
      .reduce((acc, curr) => {
        let childList = acc.get(curr.parentNutrientId as string);
        if (!childList) {
          childList = [];
          acc.set(curr.parentNutrientId as string, childList);
        }
        childList.push(curr);
        return acc;
      }, new Map<string, NutrientWithUnit[]>());

    this.parentNutrients = this.parentNutrients.filter(
      (nutrient) => !nutrient.parentNutrientId
    );
  }

  private getMacroDistribution(nutrients: NutrientMap, servings: number) {
    const CALORIE_ID = "clt6dqtz90000awv9anfb343o";
    const CARB_ID = "clt6dqtzc0007awv9h1mv5pbi";
    const PROTIEN_ID = "clt6dqtzg000uawv918m4fxsm";
    const FAT_ID = "clt6dqtze000lawv9b3w34hxe";

    const calories = nutrients.get(CALORIE_ID)?.value ?? 0;
    const carbs = nutrients.get(CARB_ID)?.value ?? 0;
    const protien = nutrients.get(PROTIEN_ID)?.value ?? 0;
    const fat = nutrients.get(FAT_ID)?.value ?? 0;

    const carbCalories = carbs * 4;
    const fatCalories = fat * 9;
    const proteinCalories = protien * 4;
    const totalCalories = carbCalories + fatCalories + proteinCalories;

    return {
      calories,
      caloriesPerServing: calories / servings,
      carbPercentage: carbCalories / totalCalories,
      proteinPercentage: proteinCalories / calories,
      fatPercentage: fatCalories / calories,
    };
  }

  private populateNutrients(
    parentNutrients: NutrientWithUnit[],
    nutrientMap: NutrientMap,
    outputList: FullNutrient[],
    advanced: boolean
  ): FullNutrient[] {
    // Find all nutrients that have the baseNutrientId as their parent
    for (const parentNutrient of parentNutrients) {
      const matchingLabelNutrient = nutrientMap.get(parentNutrient.id);
      if (matchingLabelNutrient && (advanced || !parentNutrient.advancedView)) {
        const childNutrients = this.childNutrients.get(parentNutrient.id);

        outputList.push({
          id: parentNutrient.id,
          name: parentNutrient.name,
          value: matchingLabelNutrient?.value,
          category: parentNutrient.type,
          unit: parentNutrient.unit,
          perServing: matchingLabelNutrient?.valuePerServing,
          target: {
            dri:
              parentNutrient.dri.length > 0
                ? parentNutrient.dri[0].value
                : undefined,
            customTarget: parentNutrient.customTarget ?? undefined,
          },
          children: childNutrients
            ? this.populateNutrients(childNutrients, nutrientMap, [], advanced)
            : [],
        });
      }
    }
    return outputList;
  }

  async createLabel({
    nutrients,
    servings,
    advanced,
  }: CreateLabelArgs): Promise<FullNutritionLabel> {
    if (this.parentNutrients.length == 0) {
      await this.initializeExistingNutrients();
    }

    const macros = this.getMacroDistribution(nutrients, servings.servings ?? 1);

    const fullNutrients = this.populateNutrients(
      this.parentNutrients.filter((nutrient) => !nutrient.parentNutrientId),
      nutrients,
      [],
      advanced
    );

    return {
      ...macros,
      ...servings,
      nutrients: fullNutrients,
    };
  }
}

export { NutrientAggregator, LabelMaker, FullNutrient, FullNutritionLabel };
