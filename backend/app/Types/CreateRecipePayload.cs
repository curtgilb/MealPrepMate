using App.Models;

namespace App.types;

public sealed class CreateRecipePayload(Recipe recipe)
{
    public Recipe? Recipe { get; } = recipe;
}