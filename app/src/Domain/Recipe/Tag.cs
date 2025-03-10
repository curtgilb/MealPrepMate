namespace Server.Domain.Recipe;

public enum TagType
{
    Course,
    Cuisine,
    Category,
    Custom
}

public class Tag : Entity
{
    public string Name { get; private set; }
    public TagType Type { get; private set; }

    public ICollection<Recipe> Recipes { get; private set; }

    private Tag(Guid id, string name, TagType type) : base(id)
    {
        Name = name;
        Type = type;
        Recipes = new List<Recipe>();
    }

    // Factory method for creating new tags
    public static Tag Create(string name, TagType type)
    {
        return new Tag(Guid.NewGuid(), name, type);
    }

    // Required by EF Core
    protected Tag() : base(Guid.NewGuid()) { }
}