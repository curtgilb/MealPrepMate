namespace App.types;



public static class Mutations
{
    [Mutation]
    public static async Task<CreateRecipePayload> CreateRecipeAsync(CreateRecipeInput input, Models.ApplicationDb db, CancellationToken cancellationToken)
    {
        string[] ingredients = input.Ingredients?.Split(new[] { "\r\n", "\n" }, StringSplitOptions.None) ?? [];
        var recipe = new Models.Recipe { Name = input.Name, };

        foreach (var line in ingredients)
        {
            recipe.RecipeIngredients?.Add(new Models.RecipeIngredient { Sentence = line, Recipe = recipe });
        }
        db.Recipes.Add(recipe);
        await db.SaveChangesAsync(cancellationToken);

        return new CreateRecipePayload(recipe);
    }
}


