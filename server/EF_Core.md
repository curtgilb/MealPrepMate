# EF Core Cheatsheet

## Mapping Value Objects

## Collection Navigations
You can use any type implementing ICollection and has an Add method
List - use for small lists, maintains stable ordering
HashSet is better for large lists, order is not stable, make sure they use the reference equality comparer

As a rough guideline:

For < 50 items: Use List unless you specifically need HashSet features
For 50-1000 items: Use HashSet if you do Contains() checks more than occasionally
For > 1000 items: Strongly consider HashSet if you do any Contains() checks

However, stick with List if you:
Need to maintain insertion order
Need duplicate items
Frequently access items by index
Rarely do Contains() checks
Memory is very constrained (HashSet has more overhead per item)


## Mapping Entities

## Mapping Value Objects


## One-to-One Relationship

## Many-To-Many Relationship

## One-to-Many Relationship 
https://learn.microsoft.com/en-us/ef/core/modeling/relationships/one-to-many

```csharp
public class Blog
{
    public int Id { get; set; }
    public string Name { get; set; }
    
    // Navigation property for one-to-many relationship
    public List<Post> Posts { get; set; }
}

public class Post
{
    public int Id { get; set; }
    public string Title { get; set; }
    
    // Required relationship (default)
    public int BlogId { get; set; }  // Foreign key property
    public Blog Blog { get; set; }   // Navigation property

    // Optional relationship
    public int? BlogId { get; set; }  // Foreign key property
    public Blog? Blog { get; set; }   // Navigation property
}
```

```csharp
public class Configuration : IEntityTypeConfiguration<Recipe>
{
    public void Configure(EntityTypeBuilder<Recipe> builder)
    {
        // Required one-to-many (default configuration)
        builder.Entity<Blog>()
            .HasMany(b => b.Posts)
            .WithOne(p => p.Blog)
            .HasForeignKey(p => p.BlogId)
            .OnDelete(DeleteBehavior.Cascade);  // This is the default

        // Optional one-to-many
        builder.Entity<Blog>()
            .HasMany<OptionalPost>()
            .WithOne(p => p.Blog)
            .HasForeignKey(p => p.BlogId)
            .IsRequired(false)  // Makes the relationship optional
            .OnDelete(DeleteBehavior.SetNull);  // Nulls the FK instead of deleting

    }
}
```

## Owned Entity
This will add the properties of the owned entity to the table of the owner

Configure single owned entity
```csharp
public class Order
{
    public int Id { get; set; }
    public StreetAddress ShippingAddress { get; set; }
}

public class StreetAddress
{
    public string Street { get; set; }
    public string City { get; set; }
}

modelBuilder.Entity<Order>().OwnsOne(typeof(StreetAddress), "ShippingAddress");

```


Configure collection of owned entities (creates separate table)


```csharp
public class Order
{
    private readonly HashSet<LineItem> _lineItems = new();

    private Order() {}
    public OrderId Id {get; private set;}
    public CustomerId CustomerId {get; private set;}

    public static Order Create(CustomerId cusotmerId) {
        var order = new Order {
            Id = new OrderId(Guid.NewGuid()),
            CustomerId = customerId,
        };   
        return order;
    }

}

public class LineItem 
{
    internal LineItem (LineItemId id, OrderId orderId, ProductId productId, Money price) {
        Id = id;
        OrderId = orderId;
        ProductId = productId;
        Price = price;
    }

    public IReadOnlyList<LineItem> LineItems => _lineItems.ToList();

    public LineItemId Id {get; private set;}
    public OrderId OrderId {get; private set;}
    public ProductId ProductId {get; private set;}
    public Money Price{get; private set;}

}

public record Money(string Currency, decimal Amount);

public class Product 
{
    public ProductId Id {get; private set;}
    public string Name {get; private set;} = string.Empty;
    public Money Price {get; private set;}
    public Sku Sku {get; private set;}
}

public record Sku 
{
    private const int DefaultLength = 15;
    private Sku(string value) => Value = value;
    public string Value {get; init;}

    public static Sku? Create(string value)
    {
        if(string.IsNullOrEmpty(value))
        {
            return null;
        }

        if (value.Length != DefaultLength) {
            return null;
        }

        return new Sku(value);
    }
}

public class Customer {
    public CustomerId Id {get; private set;}
    public string Email {get; private set;} = string.Empty;
    public string Name {get; private set;} = string.Empty;

    public string Name {get; private set; } = string.Empty;
}


```


```csharp 
internal class CustomerConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.HasKey(c => c.Id);

        builder.Property(C => c.Id).HasConversion(cusomterId => customerId.value, value => new CustomerId(value))

        builder.Property(c => c.Name).HasMaxLength(100);
        builder.Property(c => c.Email).HasMaxLength(255);
        builder.HasIndex(c => c.Email).isUnique();
    }
}


internal class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Id).HasConversion(cusomterId => productId.value, value => new productId(value))
        builder.Property(p => p.Sku).HasConversion(sku => sku.Value, value => Sku.Create(value)!);

        builder.OwnsOne(p => p.Price, priceBuilder => {
            priceBuilder.Property(m => m.Currency).HasMaxLength(3);
        })
    }
}


internal class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.HasKey(o => o.Id);

        builder.Property(o => o.Id).HasConversion(cusomterId => productId.value, value => new productId(value))

        builder.HasOne<Customer>().WithMany().HasForeignKey(o => o.CustomerId).IsRequired();

        builder.HasMany(o => o.LineItems).WithOne().HasForeignKey(li => li.OrderId)
    }
}

internal class LineItemConfiguration : IEntityTypeConfiguration<LineItem>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.HasKey(li => li.Id);

        builder.Property(li => li.Id).HasConversion(lineItemId => lineItemId.value, value => new LineItemId(value))

        builder.HasOne<Product>().WithMany().HasForeignKey(li => li.ProductId);

        builder.OwnsOne(li => li.Price);

    }
}


```


IN the domain layer with each entity, defined an interface for each repository. Implementations is in the infrastracture layer.

Create a abstract class of repository in the infrastructure layer, generic is the Entity Type, which must be an entity.

In the infrastructure layer