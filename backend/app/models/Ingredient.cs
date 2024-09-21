namespace App.Models
{
    public class Ingredient
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public List<string>? AlternativeNames { get; set; }

        public List<Recipe>? Recipes { get; set; }
    }
}

