namespace Server.Domain.Recipe;

public sealed class Recipe : Entity
{
    private Recipe() : base(Guid.NewGuid()) { }

    public Recipe(Guid id, string name, string? source, bool canMealPrep, string? directions, string notes, LeftoverStorageLife storageLife, List<Tag> tags)
        : base(id)
    {
        Name = name;
        Source = source;
        CanMealPrep = canMealPrep;
        Directions = directions;
        Notes = notes;
        StorageLife = storageLife;
        Tags = tags;
    }

    public  string  Name { get; private set; }
    public string? Source { get; private set; }
    public bool CanMealPrep { get; private set; }
    public string? Directions { get; private set; }
    public string? Notes { get; private set; }
    public LeftoverStorageLife StorageLife { get; private set; }

    public List<Tag> Tags { get; private set; }
}
