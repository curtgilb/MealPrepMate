using Server.Domain.Recipes;

namespace Server.Domain.Recipe;

public class Recipe
{
    public Guid Id {get; private set;}
    public string  Name {get; private set;}
    public string Source {get; private set;}
    public Time PrepTime {get; private set;}
    public Time CookTime {get; private set;}
    public Time MarinateTime {get; private set;}
    public Time TotalTime => PrepTime + CookTime + MarinateTime;
    public Time ActiveTime => PrepTime + CookTime;

    public string Directions {get; private set;}
    public string Notes {get; private set;}
    public int LeftoverFridgeLife {get; private set;}
    public int LeftoverFreezerLife {get; private set;}

}
