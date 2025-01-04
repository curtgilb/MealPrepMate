using FluentAssertions;
using Server.Domain;
using Server.Domain.Recipe;


namespace Domain.Tests;

public class TimeTests
{
    [Fact]
    public void Create_ShouldThrowException_WhenTimeIsNegative()
    {
        Action action = () => new Time(-2);
        action.Should().Throw<DomainException>().WithMessage("Time cannot be negative");
    }

    [Theory]
    [InlineData(60, 1, 0)]
    [InlineData(95, 1, 35)]
    [InlineData(0, 0, 0)]
    [InlineData(24, 0, 24)]
    [InlineData(387, 6, 27)]
    public void ShouldCalculateCorrectHoursAndMinutes(int totalMinutes, int hours, int minutes)
    {
        var time = new Time(totalMinutes);
        time.Hours.Should().Be(hours);
        time.Minutes.Should().Be(minutes);
    }

    [Theory]
    [InlineData(30, "30 mins")]
    [InlineData(60, "1:00 hours")]
    [InlineData(61, "1:01 hours")]
    public void ToString_ShouldReturnFormattedString(int minutes, string formattedString)
    {
        var time = new Time(minutes);
        time.ToString().Should().Be(formattedString);
    }

    [Fact]
    public void Add_ShouldReturnCorrectTime()
    {
        var time1 = new Time(30);
        var time2 = new Time(45);
        var result = Time.Sum(time1, time2);
        result.Hours.Should().Be(1);
        result.Minutes.Should().Be(15);
    }

    [Fact]
    public void CompareTo_ShouldReturnCorrectValue()
    {
        var time1 = new Time(30);
        var time2 = new Time(45);
        time1.CompareTo(time2).Should().Be(-1);
        time2.CompareTo(time1).Should().Be(1);
        time1.CompareTo(time1).Should().Be(0);
    }

    [Fact]
    public void RelationalOperators_ShouldReturnCorrectValue()
    {
        var time1 = new Time(30);
        var time2 = new Time(45);
        var time3 = new Time(30);

        (time1 < time2).Should().BeTrue();
        (time2 > time1).Should().BeTrue();
        (time1 == time3).Should().BeTrue();
        (time1 >= time3).Should().BeTrue();
        (time1 <= time3).Should().BeTrue();
    }
}