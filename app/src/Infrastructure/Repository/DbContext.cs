using Microsoft.EntityFrameworkCore;
using System.Reflection;
using Server.Domain.Recipe;
namespace Server.Infrastructure.Repository;
public class ApplicationContext : DbContext
{
    public DbSet<Recipe> Recipes { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            => optionsBuilder.UseNpgsql(@"Host=localhost;Database=mealprepmate;Username=application;Password=password");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}