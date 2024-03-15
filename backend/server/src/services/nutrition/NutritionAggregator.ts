import { NutrientType, MeasurementUnit } from "@prisma/client";
import { db } from "../../db.js";
import {
  LabelWithNutrients,
  NutrientWithUnit,
  NutrientValue,
} from "../../types/CustomTypes.js";

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
  //   Recipe ID/Standalone label id -> nutrient map
  private aggregatedNutrients = new Map<string, LabelAggregator>();

  private async getLabels(
    args: string[] | LabelWithNutrients[]
  ): Promise<LabelWithNutrients[]> {
    if (typeof args[0] === "string") {
      return await db.nutritionLabel.findMany({
        where: {
          verifed: true,
          recipeId: { in: args as string[] },
        },
        include: { nutrients: true, servingSizeUnit: true },
      });
    } else {
      return args as LabelWithNutrients[];
    }
  }

  async addLabels(
    args: string[] | LabelWithNutrients[],
    useLabelId: boolean = false
  ) {
    const labels = await this.getLabels(args);
    for (const label of labels) {
      const id = useLabelId ? label.id : label.recipeId;
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

  getServingInfo(recipeId: string): ServingInfo {
    const recipeLabel = this.aggregatedNutrients.get(recipeId);
    return recipeLabel?.servings ?? {};
  }

  getNutrientMap(args: NutrientMapArgs[]): NutrientMap {
    const mappings = args
      .filter((arg) => this.aggregatedNutrients.has(arg.id))
      .map((arg) => {
        const label = this.aggregatedNutrients.get(arg.id) as LabelAggregator;
        return label.getLabelNutrientMap({
          factor: arg.factor,
          totalServings: arg.totalServings,
          servingsUsed: arg.servingsUsed,
        });
      });

    if (mappings.length === 0) {
      return new Map<string, NutrientValue>();
    }
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
  servings: ServingInfo | undefined;

  addLabel(label: LabelWithNutrients) {
    this.labels.push(label);
    if (label.isPrimary) {
      this.primaryLabel = label;
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

  calculateServings(args: ScalingArgs): ScalingArgs {
    let totalServings = [
      args.totalServings,
      this.primaryLabel?.servings,
      1,
    ].find((servings) => servings);
    totalServings = totalServings ?? 1;
    const globalScaleFactor = args.factor ?? 1;
    const servingsUsed = args.servingsUsed ?? totalServings;
    this.servings = {
      servings: totalServings,
      servingsUsed,
      servingSize: this.primaryLabel?.servingSize,
      servingUnit: this.primaryLabel?.servingSizeUnit,
    };
    return {
      totalServings,
      factor: globalScaleFactor,
      servingsUsed,
    };
  }

  getLabelNutrientMap(args: ScalingArgs) {
    const mapping = new Map<string, NutrientValue>();
    const scaleArgs = this.calculateServings(args);

    this.sumNutrients(
      mapping,
      scaleArgs.factor,
      scaleArgs.totalServings,
      scaleArgs.servingsUsed
    );
    this.scaleNutrients(mapping, scaleArgs.totalServings ?? 1);
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
  servings?: number | null;
  servingsUsed?: number | null;
  servingUnit?: MeasurementUnit | null;
  servingSize?: number | null;
};

type CreateLabelArgs = {
  nutrients: NutrientMap;
  servings: ServingInfo;
  advanced: boolean;
};

type FullNutritionLabel = PrettyNutritionLabel &
  ServingInfo & { nutrients: FullNutrient[] };

class LabelMaker {
  private existingNutrients = new Map<string, NutrientWithUnit>();

  private async initializeExistingNutrients() {
    const profile = await db.healthProfile.findFirstOrThrow({});
    const age = new Date().getFullYear() - profile.yearBorn;
    // Get nutrients in order
    const nutrients = await db.nutrient.findMany({
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

    this.existingNutrients = nutrients.reduce((acc, curr) => {
      acc.set(curr.id, curr);
      return acc;
    }, new Map<string, NutrientWithUnit>());
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

  async createLabel({
    nutrients,
    servings,
    advanced,
  }: CreateLabelArgs): Promise<FullNutritionLabel> {
    if (this.existingNutrients.size == 0) {
      await this.initializeExistingNutrients();
    }

    const macros = this.getMacroDistribution(nutrients, servings.servings ?? 1);

    const fullNutrients: FullNutrient[] = [];
    nutrients.forEach((labelValue, id) => {
      const nutrientInfo = this.existingNutrients.get(id);
      if (nutrientInfo && (advanced || !nutrientInfo.advancedView)) {
        fullNutrients.push({
          id: nutrientInfo.id,
          name: nutrientInfo.name,
          value: labelValue?.value,
          category: nutrientInfo.type,
          unit: nutrientInfo.unit,
          perServing: labelValue?.valuePerServing,
          target: {
            dri:
              nutrientInfo.dri.length > 0
                ? nutrientInfo.dri[0].value
                : undefined,
            customTarget: nutrientInfo.customTarget ?? undefined,
          },
        });
      }
    });

    return {
      ...macros,
      ...servings,
      nutrients: fullNutrients,
    };
  }
}

export {
  NutrientAggregator,
  LabelMaker,
  FullNutrient,
  FullNutritionLabel,
  NutrientMap,
  ServingInfo,
  NutrientTarget,
};
