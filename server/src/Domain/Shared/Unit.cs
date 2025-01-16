using UnitsNet;
using UnitsNet.Units;

namespace Server.Domain.Shared;

public enum MeasurementType
{
    Volume,
    Mass,
    Length,
    Other
}

public enum UnitSystem
{
    Metric,
    Imperial
}

public sealed class Unit : Entity
{
    public string Name { get; private set; }
    public string Abbreviations { get; private set; }
    // Symbol must match with the abbreviation in UnitsNet
    public string Symbol { get; private set; }
    public MeasurementType MeasurementType { get; private set; }
    public UnitSystem? UnitSystem { get; private set; }
    // Is a unit used in recipes
    public Boolean IsCookingUnit { get; private set; }
    // Is a unit that can be converted to other units (i.e., 3 tsp == t tbsp)
    public Boolean IsConvertable { get; private set; }

    private Unit(Guid id, string name, string abbreviation) : base(id)
    {
        Name = name;
        Abbreviations = abbreviation;
        Symbol = Abbreviations;
    }

    public static Unit Create(string name, string abbreviation)
    {
        ParseUnknownUnit(name);
        return new Unit(new Guid(), name, abbreviation);
    }

    // public static void PrintAvailableUnits()
    // {
    //     var supportedTypes = new List<Type>
    // {
    //     typeof(VolumeUnit),
    //     typeof(MassUnit),
    //     typeof(LengthUnit),
    // };

    //     foreach (var unitType in supportedTypes)
    //     {
    //         Console.WriteLine($"\n=== {unitType.Name} ===");
    //         var units = Quantity.GetUnitInfos(unitType);

    //         foreach (var unitInfo in units)
    //         {
    //             Console.WriteLine($"Name: {unitInfo.Name}");
    //             Console.WriteLine($"Symbol: {unitInfo.Symbol}");
    //             Console.WriteLine($"Pluralized Name: {unitInfo.PluralName}");
    //             Console.WriteLine($"Abbreviations: {string.Join(", ", unitInfo.UnitAbbreviations)}");
    //             Console.WriteLine("---");
    //         }
    //     }
    // }


    private static Enum? ParseUnknownUnit(string unknownUnit)
    {

        Volume oneTsp = new Volume(1, VolumeUnit.UsTeaspoon);
        double militers = oneTsp.Milliliters;




        var supportedTypes = new List<Type>
        {
            typeof(VolumeUnit),
            typeof(MassUnit),
            typeof(LengthUnit),
        };

        foreach (var unitType in supportedTypes)
        {
            try
            {
                var unit = UnitsNetSetup.Default.UnitParser.Parse(unknownUnit, unitType);
                var unitInfo = Quantity.GetUnitInfo(unit);

                return unit;
            }
            catch (UnitNotFoundException)
            {
                continue;
            }
        }

        return null;
    }

}

