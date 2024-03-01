import { NutritionLabel, Recipe } from "@prisma/client";
import { db } from "../../db.js";
import { LabelWithNutrients } from "../../types/CustomTypes.js";

type NutrientAggregatorArgs = string[] | Recipe[] | NutritionLabel[];

// NutrientId: -> {value: number; perServing: number}
type NutrientMap = Map<string, NutrientValue>;
type NutrientValue = { value: number; valuePerServing: number };

type ScalingArgs = {
  factor?: number;
  totalServings?: number;
};

type LabelArgs = {
  id: string;
  advanced?: boolean;
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

  getNutrientMap(args: LabelArgs[]): NutrientMap {
    const mappings = args.map((arg) => {
      const label = this.aggregatedNutrients.get(arg.id);
      if (!label) throw new Error("ID does not match any in aggregation");
      return label?.getLabelNutrientMap({
        factor: arg.factor,
        totalServings: arg.totalServings,
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

  //   convertToLabel(args: LabelArgs[]);
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

  private sumNutrients(mapping: NutrientMap, scaleFactor: number) {
    for (const label of this.labels) {
      const ratio = this.getUsageRatio(label);
      for (const nutrient of label.nutrients) {
        const adjustedValue = nutrient.value * ratio * scaleFactor;
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
    const totalServings = [
      args.totalServings,
      this.primaryLabel?.servings,
      1,
    ].find((servings) => !Number.isNaN(servings));
    const globalScaleFactor = args.factor ?? 1;

    this.sumNutrients(mapping, globalScaleFactor);
    this.scaleNutrients(mapping, totalServings ?? 1);
    this.mapping = mapping;
    return mapping;
  }
}

export { NutrientAggregator };
