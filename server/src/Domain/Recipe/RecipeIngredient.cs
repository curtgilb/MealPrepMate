using Server.Domain.Shared;
namespace Server.Domain.Recipe;

public class RecipeIngredient : Entity
{
    private RecipeIngredient(Guid? id, string name) : base(id)
    {
        Name = name;
    }
    public string sentence { get; private set; }
    public Measurement Quantity { get; private set; }
    public bool Optional { get; private set; }
    public int Order { get; private set; }
    public bool Verified { get; private set; }
    public bool IsMealPrepIngredient { get; private set; }



}
