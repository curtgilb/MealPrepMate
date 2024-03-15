import { Prisma } from "@prisma/client";
import { db } from "./db.js";
import { RecipeInput } from "./types/gql.js";

const recipeInput: Prisma.RecipeFindManyArgs = {
  include: {
    ingredients: {
      include: {
        ingredient: {
          include: {
            expirationRule: true,
          },
        },
      },
    },
    nutritionLabels: {
      include: {
        nutrients: true,
        servingSizeUnit: true,
      },
    },
  },
  where: {
    OR: [
      {
        name: {
          contains: "curt",
          mode: "insensitive",
        },
      },
      {
        source: {
          contains: "curt",
          mode: "insensitive",
        },
      },
    ],
    isVerified: true,
    nutritionLabels: {
      some: {
        isPrimary: true,
        servings: {
          lte: undefined,
          gte: undefined,
          equals: undefined,
        },
      },
    },
    course: {
      every: {
        id: {
          in: undefined,
        },
      },
    },
    cuisine: {
      every: {
        id: {
          in: undefined,
        },
      },
    },
    category: {
      every: {
        id: {
          in: undefined,
        },
      },
    },
    preparationTime: {
      lte: undefined,
      gte: undefined,
      equals: undefined,
    },
    cookingTime: {
      lte: undefined,
      gte: 10,
      equals: undefined,
    },
    marinadeTime: {
      lte: undefined,
      gte: undefined,
      equals: undefined,
    },
    totalTime: {
      lte: undefined,
      gte: undefined,
      equals: undefined,
    },
    isFavorite: undefined,
  },
  orderBy: {
    name: "desc",
  },
};

const result = await db.recipe.findMany(recipeInput);
console.log("Done");
