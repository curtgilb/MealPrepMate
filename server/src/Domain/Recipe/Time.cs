namespace Server.Domain.Recipe;

public record Time : IComparable<Time>
{
    public int TotalMinutes { get; }

    public Time(int minutes)
    {
        if (minutes < 0)
        {
            throw new DomainException("Time cannot be negative");
        }
        TotalMinutes = minutes;
    }

    // Computed properties for hours and minutes
    public int Hours => TotalMinutes / 60;
    public int Minutes => TotalMinutes % 60;

    // Overload the + operator to add two Time objects
    public static Time operator +(Time a, Time b)
    {
        int totalMinutes = a.TotalMinutes + b.TotalMinutes;
        return new Time(totalMinutes);
    }

    public int CompareTo(Time? other)
    {
        if (other == null) return 1;
        return TotalMinutes.CompareTo(other.TotalMinutes);
    }

    public static bool operator <(Time? left, Time? right)
    {
        if (left is null) return right is not null;
        return left.CompareTo(right) < 0;
    }

    public static bool operator >(Time? left, Time? right)
    {
        if (left is null) return false;
        return left.CompareTo(right) > 0;
    }

    // Less than or equal operator
    public static bool operator <=(Time left, Time right)
    {
        if (left is null)
            return right is null;

        return left.CompareTo(right) <= 0;
    }

    // Greater than or equal operator
    public static bool operator >=(Time left, Time right)
    {
        if (left is null)
            return right is null;

        return left.CompareTo(right) >= 0;
    }


    // Override ToString() to return a formatted string representation
    public override string ToString()
    {
        if (Hours == 0)
        {
            return $"{Minutes} mins";
        }

        return $"{Hours}:{Minutes:D2} hours";
    }
}

