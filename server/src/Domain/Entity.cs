namespace Server.Domain;
public abstract class Entity : IEquatable<Entity>
{
    public Guid Id { get; private init; }
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; private set; } = DateTime.UtcNow;

    protected Entity(Guid id)
    {
        Id = id;
    }

    public override bool Equals(object? obj)
    {
        if (obj is null) return false;
        if (obj.GetType() != GetType()) return false;
        if (obj is not Entity entity) return false;
        return entity.Id == Id;
    }


    public bool Equals(Entity? other)
    {
        if (other is null) return false;
        if (other.GetType() != GetType()) return false;
        return other.Id == Id;
    }

    public override int GetHashCode()
    {
        return Id.GetHashCode();
    }

    public static bool operator ==(Entity left, Entity right)
    {
        return Equals(left, right);
    }

    public static bool operator !=(Entity left, Entity right)
    {
        return !Equals(left, right);
    }
}