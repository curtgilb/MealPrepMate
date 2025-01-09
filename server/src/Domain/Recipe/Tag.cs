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

    private Tag(Guid? id, string name) : base(id)
    {
        Name = name;
    }
}