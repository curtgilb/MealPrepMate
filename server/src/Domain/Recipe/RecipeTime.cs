namespace Server.Domain.Recipe;

public record RecipeTime
{
    public Time? PrepTime { get; init; }
    public Time? CookTime { get; init; }
    public Time? MarinateTime { get; init; }
    public Time TotalTime => Time.Sum(PrepTime, CookTime, MarinateTime);
    public Time ActiveTime => Time.Sum(PrepTime, CookTime);



    public static RecipeTime Sum(params RecipeTime?[] recipeTimes)
    {
        int totalPrepTime = 0;
        int totalCookTime = 0;
        int totalMarinateTime = 0;
        foreach (var recipe in recipeTimes)
        {
            if (recipe != null)
            {
                totalPrepTime += recipe.PrepTime?.TotalMinutes ?? 0;
                totalCookTime += recipe.CookTime?.TotalMinutes ?? 0;
                totalMarinateTime += recipe.MarinateTime?.TotalMinutes ?? 0;
            }
        }

        return new RecipeTime { PrepTime = new Time(totalPrepTime), CookTime = new Time(totalCookTime), MarinateTime = new Time(totalMarinateTime) };
    }

}