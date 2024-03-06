import { db } from "./db.js";

const result = await db.recipe.findMany({
  include: {
    ingredients: {
      include: { ingredient: { include: { expirationRule: true } } },
    },
  },
});
console.log(result);
