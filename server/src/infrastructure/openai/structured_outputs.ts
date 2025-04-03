import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export const recipeMetaSchema = z.object({
  courses: z
    .array(z.enum(["Breakfast", "Lunch", "Dinner", "Snack"]))
    .describe("Courses when this recipe is traditionally eaten."),
  categories: z
    .array(
      z.enum([
        "Main Dish",
        "Side Dish",
        "Dessert",
        "Appetizer",
        "Salad",
        "Bread",
        "Soup",
        "Beverage",
        "Sauce/Dressing",
      ])
    )
    .describe("Courses when this recipe is traditionally eaten."),
  can_meal_prep: z
    .boolean()
    .describe(
      "Whether the recipe is suitable for meal prepping. i.e., can be made in bulk and stored for later consumption."
    ),
  num_of_servings: z
    .number()
    .int()
    .describe("Number of servings the recipe makes"),
  weather: z
    .array(z.enum(["Hot", "Cold", "Rainy", "Snowy", "Cloudy"]))
    .describe(
      "Weather conditions the recipe is best enjoyed in such as a fresh fruit salad ona a hot day"
    ),
  season: z
    .array(z.enum(["Spring", "Summer", "Fall", "Winter"]))
    .describe(
      "Season of the year this recipe is mostly likely to be enjoyed. i.e., a spicy chili recipe would be enjoyed in the winter."
    ),
  equipment: z
    .array(z.string())
    .describe(
      "Any special or uncommon equipment needed such as certain pan sizes or utensils"
    ),
  prep_time: z
    .number()
    .int()
    .describe(
      "Prep time in minutes. Time spent chopping, mixing, measuring, etc."
    ),
  cook_time: z
    .number()
    .int()
    .describe(
      "Cook time in minutes (Time food is on the stove, oven, grill, etc.)"
    ),
  rest_time: z
    .number()
    .int()
    .describe("Rest time in minutes. Time spent marinating, cooling, etc."),
  cuisine: z.array(
    z.string().describe("Cuisine of the recipe. Ex: Italian, Mexican, etc.")
  ),
  leftover_fridge_days: z
    .number()
    .int()
    .describe("The number of days that leftovers can last in the fridge."),
  leftover_freezer_life: z
    .number()
    .int()
    .describe("Number of days the recipe can be stored in the freezer"),
  standalone_dish: z
    .boolean()
    .describe(
      "Whether the recipe is a standalone dish or eaten with another recipe"
    ),
});

// const completion = await openai.beta.chat.completions.parse({
//   model: "gpt-4o-mini",
//   messages: [
//     { role: "system", content: prompt },
//     {
//       role: "user",
//       content: JSON.stringify({
//         name: recipe.title,
//         instructions: recipe.instructions,
//         ingredients: recipe.ingredients,
//       }),
//     },
//   ],
//   response_format: zodResponseFormat(leftover_life, "LeftoverOverDays"),
//   store: true,
// });

// const message = completion.choices[0].message.content;
// const meta_data = message ? JSON.parse(message) : undefined;

// const processed_recipe = {
//   ...recipe,
//   id: uuidv4(),
//   fridge_days: meta_data?.days ?? undefined,
// };
