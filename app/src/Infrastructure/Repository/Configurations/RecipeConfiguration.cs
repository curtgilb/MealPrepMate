using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Server.Domain.Recipe;

namespace Server.Infrastructure.Repository.Configurations;

public class RecipeConfiguration : IEntityTypeConfiguration<Recipe>
{
    public void Configure(EntityTypeBuilder<Recipe> builder)
    {
        builder.HasKey(r => r.Id);

        builder.Property(c => c.Name)
               .HasMaxLength(100)
               .IsRequired();

        builder.OwnsOne(r => r.StorageLife);
    }
}

// Value object either use a value conversion or a OwnsOne