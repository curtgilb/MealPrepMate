// namespace Server.Domain.Recipe;

// public enum Season
// {
//     Winter,
//     Fall,
//     Summer,
//     Spring,
// }

// public enum Weather
// {
//     Cold,
//     Hot,
//     Rainy,
//     Snowy,
// }

// public record RecipeSeason()
// {
//     public HashSet<Season> Seasons { get; private set; }
//     public HashSet<Weather> Weather { get; private set; }

//     private RecipeSeason(HashSet<Season> sesaons, HashSet<Weather> weather)
//     {
//         Seasons = sesaons;
//         Weather = weather;
//     }

//     public static RecipeSeason Create(IEnumerable<Season> seasons, IEnumerable<Weather> weather)
//     {
//         if (seasons == null || weather == null)
//             throw new ArgumentNullException();

//         return new RecipeSeason(new HashSet<Season>(seasons), new HashSet<Weather>(weather));
//     }

// }