using System.Runtime.InteropServices;

namespace Server.Domain.Recipe;

public sealed class Recipe : Entity
{
    private Recipe(Guid id, string name, string source, int prepTime, int cookTime, int marinateTime, string directions, string notes, int leftoverFridgeLife, int leftoverFreezerLife) : base(id)
    {
        Name = name;
        Source = source;
        PrepTime = new Time(prepTime);
        CookTime = new Time(cookTime);
        MarinateTime = new Time(marinateTime);
        Directions = directions;
        Notes = notes;
        LeftoverFridgeLife = leftoverFridgeLife;
        LeftoverFreezerLife = leftoverFreezerLife;
    }
    public string Name { get; private set; }
    public string? Source { get; private set; }
    public Time PrepTime { get; private set; }
    public Time CookTime { get; private set; }
    public Time MarinateTime { get; private set; }
    public Time TotalTime => PrepTime + CookTime + MarinateTime;
    public Time ActiveTime => PrepTime + CookTime;

    public string? Directions { get; private set; }
    public string? Notes { get; private set; }
    public int? LeftoverFridgeLife { get; private set; }
    public int? LeftoverFreezerLife { get; private set; }

    public static Recipe Create(string name, string source, int prepTime, int cookTime, int marinateTime, string directions, string notes, int leftoverFridgeLife, int leftoverFreezerLife)
    {
        return new Recipe(Guid.NewGuid(), name, source, prepTime, cookTime, marinateTime, directions, notes, leftoverFridgeLife, leftoverFreezerLife);
    }

}
