using UnitsNet;
using UnitsNet.Units;
namespace Server.Domain.Shared;


public class Measurement
{
    public double Value { get; private set; }
    public Unit Unit { get; private set; }


    public Measurement(double value)
    {
        Value = value;
    }

    public double Convert()
    {
        LengthUnit.Femtometer.ToString();



        return 0;
    }

}