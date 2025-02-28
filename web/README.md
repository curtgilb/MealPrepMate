,
// updates: {
// Mutation: {
// // removeMealPlanRecipe(result, args, cache, info) {
// // cache.invalidate({
// // **typename: "MealPlanRecipe",
// // id: (args as MutationRemoveMealPlanRecipeArgs).id,
// // });
// // },
// // addRecipeServing(result, args, cache, info) {
// // const typedArgs = (args as MutationAddRecipeServingArgs).serving
// // .mealPlanId;
// // const servings = cache.resolve(
// // { **typename: "MealPlan", id: typedArgs },
// // "mealPlanServings"
// // );
// // if (Array.isArray(servings)) {
// // cache.link(
// // { **typename: "MealPlan", id: typedArgs },
// // "mealPlanServings",
// // [...servings, result.addRecipeServing]
// // );
// // }
// // },
// // deleteRecipeServing(result, args, cache, info) {
// // cache.invalidate({
// // **typename: "MealPlanServing",
// // id: (args as MutationDeleteRecipeServingArgs).id,
// // });
// // },
// // addRecipeToMealPlan(result, args, cache, info) {
// // const mealPlanId = (args as MutationAddRecipeToMealPlanArgs)
// // .recipe.mealPlanId;
// // const mealPlan = cache.resolve(
// // { **typename: "MealPlan", id: mealPlanId },
// // "planRecipes"
// // );
// // if (Array.isArray(mealPlan)) {
// // cache.link(
// // { **typename: "MealPlan", id: mealPlanId },
// // "planRecipes",
// // [...mealPlan, result.addRecipeToMealPlan]
// // );
// // }
// // },
// // setRankedNutrients(result, args, cache, info) {
// // const rankedNutrients = cache.resolve(
// // "Query",
// // "getRankedNutrients"
// // );
// // if (
// // Array.isArray(rankedNutrients) &&
// // Array.isArray(result.setRankedNutrients)
// // ) {
// // cache.link("Query", "getRankedNutrients", [
// // ...result.setRankedNutrients,
// // ]);
// // }
// // },
// },
// },
