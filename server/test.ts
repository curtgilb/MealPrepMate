import "dotenv/config";
import { RecipeKeeperTransformer } from "@/application/services/import/transformers/RecipeKeeperTransformer.js";
import { createBuckets, deleteBuckets } from "@/seed/seed.js";

await deleteBuckets();
await createBuckets();

const transformer = new RecipeKeeperTransformer();
const records = await transformer.transform({
  type: "local",
  filePath: "C:\\Users\\cgilb\\Desktop\\RecipeKeeper_20241010_135410.zip",
});
console.log(records);
