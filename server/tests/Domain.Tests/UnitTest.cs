using FluentAssertions;
using Server.Domain;
using Server.Domain.Recipe;
using Server.Domain.Shared;


namespace Domain.Tests;

public class UnitTest
{
    [Fact]
    public void InitializeUnit_ShouldCorrectlyParse()
    {
        // Unit.PrintAvailableUnits();
        var unit = Unit.Create("UsTablespoon", "C");

    }



}