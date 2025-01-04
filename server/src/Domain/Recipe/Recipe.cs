namespace Server.Domain.Recipe;

public sealed class Recipe(Guid id, string name, string? source, Time? prepTime, Time? cookTime, Time? marinateTime, string? directions, string? notes, int? leftoverFridgeLife, int? leftoverFreezerLife) : Entity(id)
{
    public string Name { get; private set; } = name;
    public string? Source { get; private set; } = source;
    public Time? PrepTime { get; private set; } = prepTime;
    public Time? CookTime { get; private set; } = cookTime;
    public Time? MarinateTime { get; private set; } = marinateTime;
    public Time TotalTime => Time.Sum(PrepTime, CookTime, MarinateTime);
    public Time ActiveTime => Time.Sum(PrepTime, CookTime);

    public string? Directions { get; private set; } = directions;
    public string? Notes { get; private set; } = notes;
    public int? LeftoverFridgeLife { get; private set; } = leftoverFridgeLife;
    public int? LeftoverFreezerLife { get; private set; } = leftoverFreezerLife;

}
