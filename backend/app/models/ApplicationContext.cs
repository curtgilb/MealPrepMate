using Microsoft.EntityFrameworkCore;

namespace App.Models
{
    public class ApplicationDb(DbContextOptions<ApplicationDb> options) : DbContext(options)
    {
        public DbSet<Recipe> Recipes { get; set; }
        public DbSet<RecipeIngredient> RecipeIngredients { get; set; }
        public DbSet<Ingredient> Ingredient { get; set; }

    }
}
