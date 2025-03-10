namespace Server.Domain.Recipe;

public record Time : IComparable<Time>
{
    public int TotalMinutes { get; }

    public Time(int? minutes)
    {
        TotalMinutes = minutes ?? 0;
        if (TotalMinutes < 0)
        {
            throw new DomainException("Time cannot be negative");
        }
    }

    // Computed properties for hours and minutes
    public int Hours => TotalMinutes / 60;
    public int Minutes => TotalMinutes % 60;

    public static Time Sum(params Time?[] times)
    {
        int totalMinutes = 0;
        foreach (var time in times)
        {
            if (time != null)
            {
                totalMinutes += time.TotalMinutes;
            }
        }
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

