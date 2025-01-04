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

        builder.Property(r => r.PrepTime).HasConversion<int?>(time => (time == null) ? null : time.TotalMinutes, value => (value == null) ? null : new Time(value));
        builder.Property(r => r.CookTime).HasConversion<int?>(time => (time == null) ? null : time.TotalMinutes, value => (value == null) ? null : new Time(value));
        builder.Property(r => r.MarinateTime).HasConversion<int?>(time => (time == null) ? null : time.TotalMinutes, value => (value == null) ? null : new Time(value));

        // Ignore computed properties
        builder.Ignore(r => r.TotalTime);
        builder.Ignore(r => r.ActiveTime);

    }
}

// Value object either use a value conversion or a OwnsOne