namespace Server.Domain.Recipe;

public sealed class Recipe : Entity
{

    private Recipe(Guid? id, string name, string? source, bool canMealPrep, string? directions, string notes, RecipeTime cookingTimes, LeftoverStorageLife leftoverStorageLife) : base(id)
    {
        Name = name;
        Source = source;
        CanMealPrep = canMealPrep;
        Directions = directions;
        Notes = notes;
        CookingTimes = cookingTimes;
        LeftoverLife = leftoverStorageLife;
    }

    public string Name { get; private set; }
    public string? Source { get; private set; }
    public bool CanMealPrep { get; private set; }
    public string? Directions { get; private set; }
    public string? Notes { get; private set; }
    public RecipeTime CookingTimes { get; private set; }
    public LeftoverStorageLife LeftoverLife { get; private set; }
    // Ingredients
    public ICollection<RecipeIngredient> Ingredients { get; private set; };


    public static Recipe Create(string name, string? source, bool canMealPrep, string? directions, string notes, RecipeTime cookingTimes, LeftoverStorageLife leftoverStorageLife)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new DomainException("Name cannot be empty");
        }

        return new Recipe(Guid.NewGuid(), name, source, canMealPrep, directions, notes, cookingTimes, leftoverStorageLife);
    }


}
