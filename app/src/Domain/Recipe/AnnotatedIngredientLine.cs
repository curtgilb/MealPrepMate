using Server.Domain.Shared;

namespace Server.Domain.Recipe;

public record AnnotatedIngredientLine
{
    public string Text { get; private set; }
    public ICollection<Annotation> Annotations { get; private set; }

    private AnnotatedIngredientLine(string text, ICollection<Annotation> annotations)
    {
        Text = text;
        Annotations = annotations;
    }

    public static AnnotatedIngredientLine Create(string text, ICollection<Annotation> annotations)
    {
        if (string.IsNullOrWhiteSpace(text))
            throw new ArgumentNullException();

        return new AnnotatedIngredientLine(text, annotations);
    }
}

public enum AnnotationType
{
    Amount,
    Unit,
    Ingredient,
    Quantity,
    MaxQuantity,
}

public record Annotation
{
    public required string Substring { get; init; }
    public AnnotationType Type { get; init; }
    public int StartIndex { get; init; }
    public int EndIndex { get; init; }

}

public record QuantityAnnotation : Annotation
{
    public Measurement Measurement { get; init; }
}