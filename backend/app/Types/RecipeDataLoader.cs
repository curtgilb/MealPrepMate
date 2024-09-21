using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace App.types;

public static class DataLoaders
{
    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, App.Models.Recipe>> RecipeByIdAsync(
        IReadOnlyList<Guid> ids,
        App.Models.ApplicationDb db,
        CancellationToken cancellationToken)
    {
        var recipes = await db.Recipes
            .Where(recipe => ids.Contains(recipe.Id))
            .ToDictionaryAsync(x => x.Id, cancellationToken);

        return recipes;
    }
}


