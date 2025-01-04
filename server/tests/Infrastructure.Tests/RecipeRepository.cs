namespace Infrastructure.Tests;

using Server.Application.Repository;
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
        var recipe = new Recipe(new Guid(), "Test Recipe", "Test Source", new Time(10), new Time(20), new Time(30), "Test Directions", "Test Notes", 5, 10);
        await _repository.AddAsync(recipe);
        await _iUnitOfWork.SaveChangesAsync();

    }
}