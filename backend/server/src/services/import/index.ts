import { processReciperKeeperImport } from "./RecipeKeeper.js";

export async function importRecipeKeeperFile(source: string | File) {
  await processReciperKeeperImport(source);
}

export function importCronometerFile(source: string | File) {
  console.log("Importing cronometer file");
}
