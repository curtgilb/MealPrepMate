using Server.Application.Abstractions.Messaging;
using Server.Application.Abstractions.Repository;
using Server.Application.Recipe.Commands.CreateRecipe;
using Server.Domain.Abstractions.Result;
using Server.Domain.Recipe;

internal sealed class CreateRecipeCommandHandler(IRepository<Recipe> recipeRepository, IUnitOfWork unitOfWork) : ICommandHandler<CreateRecipeCommand, Recipe>
{
    private readonly IRepository<Recipe> _recipeRepository = recipeRepository;
    private readonly IUnitOfWork _unitOfWork = unitOfWork;

    public async Task<Result<Recipe>> Handle(CreateRecipeCommand command, CancellationToken cancellationToken)
    {
        var tags = new List<Tag> { Tag.Create("Lunch", TagType.Cuisine), Tag.Create("Lunch", TagType.Cuisine) };
        var recipe = new Recipe(new Guid(), "Hamburger", "https://downshiftology.com", true, "directions here", "Notes here", new LeftoverStorageLife(4, 90), tags);
        await _recipeRepository.Add(recipe);
        await _unitOfWork.SaveChangesAsync();
        return Result.Success(recipe);
    }
}