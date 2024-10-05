import { db } from "@/infrastructure/repository/db.js";
import { searchIngredients } from "@prisma/client/sql";

const results = await db.$queryRawTyped(searchIngredients("boston", 1));
console.log(results);
