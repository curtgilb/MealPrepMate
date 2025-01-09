namespace Server.Domain.Recipe;

public record LeftoverStorageLife(int? FridgeLife, int? FreezerLife)
{
    public int? LeftoverFridgeLife { get; private set; } = FridgeLife;
    public int? LeftoverFreezerLife { get; private set; } = FreezerLife;
}