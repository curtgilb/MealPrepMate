namespace App.types;
public sealed record CreateRecipeInput(
    string Name,
    string? Ingredients);