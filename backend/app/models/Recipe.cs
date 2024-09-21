namespace App.Models
{
    public class Recipe
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public ICollection<Ingredient>? Ingredients { get; } = [];
        public ICollection<RecipeIngredient>? RecipeIngredients { get; } = [];
    }
}








