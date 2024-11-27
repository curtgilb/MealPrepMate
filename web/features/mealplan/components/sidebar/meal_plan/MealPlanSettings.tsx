import { z } from "zod";

const mealPlanSettingsValidation = z.object({
  days: z.number().min(1).max(7),
});

export function MealPlanSettings() {
  return <div>MealPlanSettings</div>;
}
