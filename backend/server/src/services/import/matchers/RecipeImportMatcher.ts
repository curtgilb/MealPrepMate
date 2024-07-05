// import { db } from "../../../db.js";
// import { MatchManager } from "../importers/Import.js";

// class RecipeImportMatcher {
//   async match(hash: string, externalId: string | undefined, name: string) {
//     const match = new MatchManager({ status: "IMPORTED" });
//     const [importRecord, matchingLabel, matchingRecipe] = await db.$transaction(
//       [
//         db.importRecord.findFirst({
//           where: {
//             OR: [{ hash: hash }, { externalId: externalId }],
//           },
//         }),
//         db.nutritionLabel.findFirst({
//           where: {
//             name: { contains: name, mode: "insensitive" },
//             isPrimary: true,
//           },
//         }),
//         db.recipe.findFirst({
//           where: {
//             name: {
//               contains: name,
//               mode: "insensitive",
//             },
//           },
//         }),
//       ]
//     );
//     // Check imports
//     if (importRecord) {
//       const ignore = importRecord.status === "IGNORED";
//       if (importRecord.hash === hash && hash) {
//         match.setMatch({
//           status: ignore ? "IGNORED" : "DUPLICATE",
//         });
//       } else if (importRecord.externalId === externalId && externalId) {
//         match.setMatch({
//           status: "UPDATED",
//         });
//       }
//       match.setMatch({
//         labelMatchId: importRecord.nutritionLabelId ?? undefined,
//         recipeMatchId: importRecord.recipeId ?? undefined,
//         ingredientGroupId: importRecord.ingredientGroupId ?? undefined,
//       });
//       return match.getMatch();
//     }

//     // Check labels
//     if (matchingLabel) {
//       match.setMatch({ labelMatchId: matchingLabel.id });
//     }

//     if (matchingRecipe) {
//       match.setMatch({ recipeMatchId: matchingRecipe.id, status: "UPDATED" });
//     }
//     return match.getMatch();
//   }
// }

// export { RecipeImportMatcher };
