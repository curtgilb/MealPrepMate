namespace Infrastructure.Tests;

using Server.Application.Abstractions.Repository;
using Server.Infrastructure.Repository;
using Microsoft.EntityFrameworkCore;

using Server.Domain.Recipe;

public class RecipeRepositoryTests
{


    private readonly IRepository<Recipe> _repository;
    private readonly UnitOfWork _iUnitOfWork;

    public RecipeRepositoryTests()
    {
        var db = new ApplicationContext();
        _repository = new Repository<Recipe>(db);
        _iUnitOfWork = new UnitOfWork(db);
    }

    [Fact]
    public async Task Test1()

    {
        var tags = new List<Tag> { Tag.Create("Lunch", TagType.Cuisine), Tag.Create("Lunch", TagType.Cuisine) };
        var recipe = new Recipe(new Guid(), "Hamburger", "https://downshiftology.com", true, "directions here", "Notes here", new LeftoverStorageLife(4, 90), tags );
        await _repository.Add(recipe);
        await _iUnitOfWork.SaveChangesAsync();

    }
}