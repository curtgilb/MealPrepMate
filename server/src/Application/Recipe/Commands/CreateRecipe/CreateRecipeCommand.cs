using Server.Application.Abstractions.Messaging;
using Server.Domain;


namespace Server.Application.Recipe.Commands.CreateRecipe;

public sealed record CreateRecipeCommand(
    string Name
) : ICommand<Domain.Recipe.Recipe>;
