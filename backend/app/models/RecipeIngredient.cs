
namespace App.Models
{
    public class RecipeIngredient
    {
        public Guid Id { get; init; }
        public required string Sentence { get; init; }

        public decimal Quantity { get; init; }
        public required Recipe Recipe { get; init; }
        public Ingredient? Ingredient { get; init; }

    }
}