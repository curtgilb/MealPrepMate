import {
  LabelAggregator,
  LabelWithNutrients,
} from "@/application/services/nutrition/LabelAggregator.js";
import { db, DbTransactionClient } from "@/infrastructure/repository/db.js";

async function updateAggregateLabel(
  recipeId: string,
  labels: LabelWithNutrients[] | undefined = undefined,
  tx?: DbTransactionClient
) {
  const client = tx ? tx : db;
  const aggregator = new LabelAggregator(recipeId, client, labels);
  return await aggregator.upsertAggregateLabel();
}

export { updateAggregateLabel };
