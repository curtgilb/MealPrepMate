using Server.Domain.Shared;
namespace Server.Domain.Recipe;




public class RecipeIngredient : Entity
{
    private RecipeIngredient(Guid? id, string name) : base(id)
    {

    }
    public string OriginalSentence { get; private set; }

    // If a range is used, split the difference (1-2 tbsp == 1.5 tbsp)
    // If a composite amount, add them together (1 cup plus 2 tbsp)
    public Measurement Quantity { get; private set; }
    public bool Optional { get; private set; }
    public int Order { get; private set; }
    public bool Verified { get; private set; }
    public bool IsMealPrepIngredient { get; private set; }
    public AnnotatedIngredientLine AnnotatedIngredientLine { get; private set; }

}
