import {
  MealPlanRecipe,
  MealPlanServing,
  NotificationSetting,
  Prisma,
  ScheduledPlan,
} from "@prisma/client";
import { db } from "../../../infrastructure/repository/db.js";
import { DateTime } from "luxon";
import { getIngredientMaxFreshness } from "../ingredient/IngredientService.js";
import { notificationsQueue } from "../../../Schedule.js";

const mealPlanWithRecipeServings =
  Prisma.validator<Prisma.MealPlanDefaultArgs>()({
    include: {
      mealPlanServings: true,
      planRecipes: {
        include: {
          recipe: true,
          servings: { orderBy: { day: "asc" } },
        },
      },
    },
  });

type FullMealPlan = Prisma.MealPlanGetPayload<
  typeof mealPlanWithRecipeServings
>;

const mealPlanRecipeWithRecipeAndServings =
  Prisma.validator<Prisma.MealPlanRecipeDefaultArgs>()({
    include: {
      recipe: true,
      servings: true,
    },
  });

type FullMealPlanRecipe = Prisma.MealPlanRecipeGetPayload<
  typeof mealPlanRecipeWithRecipeAndServings
>;

const scheduleWithNotifciations =
  Prisma.validator<Prisma.ScheduledPlanDefaultArgs>()({
    include: {
      notifications: true,
    },
  });

type FullScheduledMealPlan = Prisma.ScheduledPlanGetPayload<
  typeof scheduleWithNotifciations
>;

// type ScheduledPlanQuery = {
//   include?: Prisma.ScheduledPlanInclude | undefined;
//   select?: Prisma.ScheduledPlanSelect | undefined;
// };

async function scheduleMealPlan(
  mealPlanId: string,
  date: Date,
  query: ScheduledPlanQuery
): Promise<ScheduledPlan> {
  console.log(query);
  const { startingDate, notificationSetting, mealPlan } = await getMealPlanInfo(
    mealPlanId,
    date
  );

  const notifications = await createNotifications(
    mealPlan,
    startingDate,
    notificationSetting
  );
  const duration = getMealPlanDurtation(mealPlan);

  const schedule = await db.scheduledPlan.create({
    data: {
      startDate: date,
      duration,
      mealPlan: { connect: { id: mealPlanId } },
      recipes: mealPlan.planRecipes,
      shoppingDays: mealPlan.shoppingDays,
      notifications: { createMany: { data: notifications } },
    },
    include: { notifications: true },
  });
  await addNotificationsToQueue(schedule);
  return schedule;
}

async function addNotificationsToQueue(schedule: FullScheduledMealPlan) {
  for (const notification of schedule.notifications) {
    const deliveryDate = DateTime.fromJSDate(notification.deliveryDate);
    const millisecond = deliveryDate.diffNow("milliseconds");
    if (notification.status === "SCHEDULED") {
      await notificationsQueue.add(
        notification.id,
        { message: notification.message },
        { delay: millisecond.milliseconds }
      );
    }
  }
}

async function createNotifications(
  mealPlan: FullMealPlan,
  startingDate: DateTime,
  notificationSetting: NotificationSetting
): Promise<Prisma.NotificationCreateManyScheduleInput[]> {
  const notifications: Prisma.NotificationCreateManyScheduleInput[] = [];
  for (const recipe of mealPlan.planRecipes) {
    const cookDay = getRecipeCookDay(recipe, recipe.servings);

    // Defrost notification
    await addDefrostNotification(
      notifications,
      notificationSetting,
      mealPlan.shoppingDays,
      recipe,
      startingDate,
      cookDay
    );

    // Recipe Expiration Warning
    addExpirationWarning(
      notifications,
      notificationSetting,
      recipe,
      cookDay,
      startingDate
    );
  }

  return notifications;
}

function getMealPlanDurtation(mealPlan: FullMealPlan) {
  mealPlan.mealPlanServings.sort((a, b) => b.day - a.day);
  const duration =
    mealPlan.mealPlanServings[mealPlan.mealPlanServings.length - 1].day;
  return duration;
}

async function addDefrostNotification(
  notifications: Prisma.NotificationCreateManyScheduleInput[],
  notificationSetting: NotificationSetting,
  shoppingDays: number[],
  recipe: FullMealPlanRecipe,
  startingDate: DateTime,
  cookDay: number
) {
  const daysBeforeCooking = getDaysBetweenShopAndCook(shoppingDays, cookDay);

  if (
    notificationSetting.defrostWarning &&
    (await needsToBeFrozen(daysBeforeCooking, recipe.recipeId))
  ) {
    const freezableIngredients = await getRecipeFreezableIngredients(
      recipe,
      daysBeforeCooking
    );
    const message = `Remember to take out ingredients to defrost for ${recipe.recipe.name}.\n Ingredients: ${freezableIngredients}`;

    notifications.push({
      deliveryDate: startingDate
        .plus({ days: cookDay - 2 })
        .set({ hour: notificationSetting.defrostWarningTime })
        .toISO() as string,
      message,
      status: "SCHEDULED",
    });
  }
}

async function getRecipeFreezableIngredients(
  recipe: FullMealPlanRecipe,
  daysBeforeCooking: number
): Promise<string> {
  // This recipe needs to be defrosted, get list of ingredients that need to be frozen
  const ingredientsToBeFrozen = await db.recipeIngredient.findMany({
    where: {
      recipeId: recipe.recipeId,
      ingredient: {
        expirationRule: {
          fridgeLife: { lt: daysBeforeCooking },
          tableLife: { lt: daysBeforeCooking },
          freezerLife: { gte: daysBeforeCooking },
        },
      },
    },
    include: { unit: true },
  });
  const freezableIngredients = ingredientsToBeFrozen.map((ingredient) => {
    const qty = ingredient.quantity
      ? `${ingredient.quantity * recipe.factor}`
      : "";
    return `${qty} ${ingredient.unit?.symbol} ${ingredient.name}\n`;
  });
  return freezableIngredients.join("\n");
}

function addExpirationWarning(
  notifications: Prisma.NotificationCreateManyScheduleInput[],
  notificationSetting: NotificationSetting,
  recipe: FullMealPlanRecipe,
  cookDay: number,
  startingDate: DateTime
) {
  if (notificationSetting.leftoverExpiration) {
    const recipeExpDays = recipe.recipe.leftoverFridgeLife ?? 4;
    const dayBeforeExp = cookDay + recipeExpDays;
    notifications.push({
      deliveryDate: startingDate
        .plus({ days: dayBeforeExp - 2 })
        .set({ hour: notificationSetting.leftoverTime })
        .toISO() as string,
      status: "SCHEDULED",
      message: `${recipe.recipe.name} is expiring tomorrow. Consider putting it the freezer; it lasts ${recipe.recipe.leftoverFreezerLife} days in the freezer.`,
    });
  }
}

async function getMealPlanInfo(mealPlanId: string, date: Date) {
  const mealPlan = await db.mealPlan.findUniqueOrThrow({
    where: { id: mealPlanId },
    include: {
      mealPlanServings: true,
      planRecipes: {
        include: {
          recipe: true,
          servings: { orderBy: { day: "asc" } },
        },
      },
    },
  });

  const notificationSetting = await db.notificationSetting.findFirstOrThrow();

  const startingDate = DateTime.fromJSDate(date)
    .setZone(notificationSetting.timeZone)
    .set({ hour: 0, minute: 0, millisecond: 0 });

  return {
    mealPlan,
    notificationSetting,
    startingDate,
  };
}

function getRecipeCookDay(
  recipe: MealPlanRecipe,
  recipeServings: MealPlanServing[]
) {
  if (recipe.cookDayOffset) return recipe.cookDayOffset;
  if (recipeServings.length > 0) {
    recipeServings.sort((a, b) => a.day - b.day);
    return recipeServings[0].day;
  }
  return 0;
}

function getDaysBetweenShopAndCook(shoppingDays: number[], cookDay: number) {
  shoppingDays.sort((a, b) => b - a);
  const closestShoppingDay =
    shoppingDays.find((shoppingDay) => cookDay >= shoppingDay) ?? 1;
  return cookDay - closestShoppingDay;
}

async function needsToBeFrozen(
  daysBetweenShopAndCook: number,
  recipeId: string
) {
  const freshness = await getIngredientMaxFreshness(recipeId);
  return (
    daysBetweenShopAndCook > freshness.maxTableLife &&
    daysBetweenShopAndCook > freshness.maxFridgeLife &&
    daysBetweenShopAndCook <= freshness.maxFreezerLife
  );
}

export { scheduleMealPlan };
