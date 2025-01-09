namespace Server.Domain.Recipe;

public record AnnotatedText
{
    public string Text { get; private set; }
    public ICollection<Annotation> Annotations { get; private set; }

    private AnnotatedText(string text, ICollection<Annotation> annotations)
    {
        Text = text;
        Annotations = annotations;
    }

    public static AnnotatedText Create(string text, ICollection<Annotation> annotations)
    {
        if (string.IsNullOrWhiteSpace(text))
            throw new ArgumentNullException();

        return new AnnotatedText(text, annotations);
    }
}

public enum AnnotationType
{
    Amount,
    Unit,
    Ingredient,
}

public record Annotation
{
    public required string Substring { get; init; }
    public AnnotationType Type { get; init; }
    public int StartIndex { get; init; }
    public int EndIndex { get; init; }
}