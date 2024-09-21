using System.ComponentModel;
using App.Models;
using Microsoft.EntityFrameworkCore;


namespace App.types;
public static class RecipeQueries
{
    [Query]
    public static async Task<IEnumerable<Recipe>> GetRecipesAsync(ApplicationDb db, CancellationToken cancellationToken)
    {
        return await db.Recipes.ToListAsync(cancellationToken);
    }

    [Query]
    public static async Task<Recipe?> GetRecipeAsync(Guid id, RecipeByIdDataLoader recipeById, CancellationToken cancellationToken)
    {
        return await recipeById.LoadAsync(id, cancellationToken);
    }
}
